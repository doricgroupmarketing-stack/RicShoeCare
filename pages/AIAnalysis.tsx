import React, { useState, useRef, useEffect } from 'react';
import { Upload, Camera, Sparkles, AlertCircle, CheckCircle2, RefreshCw, ShoppingBag, ArrowRight, Key } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyzeShoeImage, checkAIConfiguration, requestAIKey } from '../services/geminiService';
import { AnalysisResult, AnalysisStatus } from '../types';
import { useInventory } from '../hooks/useInventory';
import SEOHead from '../components/SEOHead';

const AIAnalysis: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAIConfigured, setIsAIConfigured] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { items: products } = useInventory();

  useEffect(() => {
    const checkConfig = async () => {
      const configured = await checkAIConfiguration();
      setIsAIConfigured(configured);
    };
    checkConfig();
  }, []);

  const handleConnectAI = async () => {
    await requestAIKey();
    const configured = await checkAIConfiguration();
    setIsAIConfigured(configured);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1024;
          const MAX_HEIGHT = 1024;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
            setImage(compressedBase64);
            setResult(null);
            setStatus(AnalysisStatus.IDLE);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalysis = async () => {
    if (!image) return;
    
    if (!isAIConfigured) {
      await handleConnectAI();
      return;
    }

    try {
      setStatus(AnalysisStatus.ANALYZING);
      const mimeType = image.split(';')[0].split(':')[1];
      const base64Data = image.split(',')[1];
      const data = await analyzeShoeImage(base64Data, mimeType);
      setResult(data);
      setStatus(AnalysisStatus.COMPLETE);
    } catch (error: any) {
      console.error(error);
      const errMsg = error.message || String(error);
      const lowerErrMsg = errMsg.toLowerCase();
      if (lowerErrMsg.includes('api_key_invalid') || lowerErrMsg.includes('not found') || lowerErrMsg.includes('key') || lowerErrMsg.includes('unregistered callers') || lowerErrMsg.includes('permission_denied')) {
        setIsAIConfigured(false);
      }
      setStatus(AnalysisStatus.ERROR);
    }
  };

  useEffect(() => {
    if (image && status === AnalysisStatus.IDLE && isAIConfigured) {
      handleAnalysis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, status, isAIConfigured]);

  const resetAnalysis = () => {
    setImage(null);
    setResult(null);
    setStatus(AnalysisStatus.IDLE);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getRecommendedProducts = (analysis: AnalysisResult) => {
    // 1. Try to match specific products returned by AI
    if (analysis.recommendedProducts && analysis.recommendedProducts.length > 0) {
      const aiMatches = products.filter(p => 
        analysis.recommendedProducts.some(rec => 
          p.name.toLowerCase().includes(rec.toLowerCase()) || 
          rec.toLowerCase().includes(p.name.toLowerCase())
        )
      );
      
      // If we found matches from the AI suggestions, return them
      if (aiMatches.length > 0) {
        return aiMatches.slice(0, 3);
      }
    }

    // 2. Fallback Heuristics if AI returned nothing specific or no matches found
    const service = analysis.recommendedService.toLowerCase();
    const material = analysis.material.toLowerCase();
    
    // Fallback recommended IDs
    let recommendedIds: string[] = ['prod-2']; // Essential Kit is good for everyone

    if (service.includes('suede') || material.includes('suede') || material.includes('nubuck')) {
      recommendedIds.push('prod-8'); // Suede spray
      recommendedIds.push('prod-4'); // Brush
    } else if (service.includes('sole')) {
      recommendedIds.push('prod-6'); // Sole Brightener
    } else if (material.includes('leather')) {
      recommendedIds.push('prod-1'); // Polish
      recommendedIds.push('prod-7'); // Cream
    } else {
      recommendedIds.push('prod-3'); // Repellent
      recommendedIds.push('prod-5'); // Towels
    }

    // Filter products from realtime state and limit to 3 items
    return products
      .filter(p => recommendedIds.includes(p.id))
      .slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <SEOHead 
        title="AI Shoe Diagnosis" 
        description="Upload a photo of your shoes for instant AI analysis and professional care recommendations."
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-full text-primary-600 mb-4">
            <Sparkles size={32} />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">AI Shoe Doctor</h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Upload a clear photo of your shoes. Our Gemini-powered AI will analyze the material, condition, and recommend the best RIC products.
          </p>

          {!isAIConfigured && (
            <div className="mt-8 max-w-md mx-auto p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-4 text-left animate-fade-in">
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <Key size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-blue-900">AI Connection Required</p>
                <p className="text-xs text-blue-700">To use the AI scanner in the published app, please connect your Gemini API key.</p>
              </div>
              <button 
                onClick={handleConnectAI}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Connect
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 relative overflow-hidden group hover:border-primary-300 transition-colors">
              {image ? (
                <img src={image} alt="Uploaded Shoe" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center p-6 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4 text-gray-400 group-hover:text-primary-500 transition-colors">
                    <Upload size={32} />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Upload an image</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageUpload} 
                accept=".jpg,.jpeg,.png,.webp" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
            </div>

            <div className="mt-6">
              {status === AnalysisStatus.ANALYZING ? (
                <button disabled className="w-full bg-gray-100 text-gray-500 font-bold py-4 rounded-xl flex items-center justify-center gap-3 cursor-not-allowed">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
                  Analyzing...
                </button>
              ) : image && status !== AnalysisStatus.COMPLETE ? (
                <button onClick={handleAnalysis} className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-gray-900/20">
                  <Sparkles size={20} /> Analyze Shoe
                </button>
              ) : status === AnalysisStatus.COMPLETE ? (
                <button onClick={resetAnalysis} className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all">
                  <RefreshCw size={20} /> Scan Another
                </button>
              ) : (
                <button onClick={() => fileInputRef.current?.click()} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-600/20">
                  <Upload size={20} /> Select Photo
                </button>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full relative overflow-hidden">
            {status === AnalysisStatus.IDLE && !image && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <Sparkles size={64} className="mb-4 text-gray-400" />
                <p className="text-lg font-medium text-gray-900">Waiting for image...</p>
                <p className="text-sm text-gray-500">Upload a photo to see the magic happen.</p>
              </div>
            )}

            {status === AnalysisStatus.IDLE && image && (
               <div className="h-full flex flex-col items-center justify-center text-center">
               <p className="text-lg font-medium text-gray-900 mb-2">Ready to Analyze</p>
               <p className="text-sm text-gray-500">Click the button on the left to start diagnosis.</p>
             </div>
            )}

            {status === AnalysisStatus.ANALYZING && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-gray-100 border-t-primary-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles size={24} className="text-primary-500 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Scanning Material...</h3>
                  <p className="text-gray-500 mt-2">Identifying texture, wear patterns, and soil levels.</p>
                </div>
              </div>
            )}

            {status === AnalysisStatus.COMPLETE && result && (
              <div className="animate-fade-in-up">
                <div className="flex items-center gap-2 mb-6 text-green-600 font-medium bg-green-50 w-fit px-3 py-1 rounded-full">
                  <CheckCircle2 size={16} /> Analysis Complete
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Diagnosis Report</h3>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-1">Type</p>
                      <p className="text-lg font-bold text-gray-900">{result.shoeType}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-1">Material</p>
                      <p className="text-lg font-bold text-gray-900">{result.material}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                    <p className="text-xs text-orange-600 uppercase font-semibold tracking-wider mb-1">Condition</p>
                    <p className="text-lg font-bold text-gray-900">{result.condition}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Our Recommendation</h4>
                    <div className="bg-gray-900 text-white p-5 rounded-xl shadow-lg relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
                       <div className="relative z-10">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="text-xl font-bold text-primary-400">{result.recommendedService}</h5>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed border-t border-gray-700 pt-3 mt-3">
                          {result.reasoning}
                        </p>
                       </div>
                    </div>
                  </div>

                  <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all">
                    Book This Service
                  </button>

                  {/* Recommended Products Section */}
                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <ShoppingBag className="text-primary-600" size={20} />
                      Recommended RIC Products
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {getRecommendedProducts(result).map(product => (
                        <Link 
                          to={`/product/${product.id}`} 
                          key={product.id} 
                          className="flex items-center gap-3 p-2 rounded-xl border border-gray-100 hover:border-primary-300 hover:shadow-md transition-all group bg-gray-50"
                        >
                          <div className="w-14 h-14 bg-white rounded-lg overflow-hidden shrink-0 border border-gray-200">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-sm text-gray-900 truncate group-hover:text-primary-600 transition-colors">{product.name}</h5>
                            <p className="text-xs text-gray-500 truncate">{product.category}</p>
                          </div>
                          <div className="text-right pr-2 flex items-center">
                            <span className="text-xs text-primary-600 font-medium flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              View <ArrowRight size={10} />
                            </span>
                          </div>
                        </Link>
                      ))}
                      {getRecommendedProducts(result).length === 0 && (
                        <p className="text-sm text-gray-500">No specific product matches found in stock, but our technicians will use the best RIC products for your service.</p>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {status === AnalysisStatus.ERROR && (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <AlertCircle size={48} className="text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900">Analysis Failed</h3>
                <p className="text-gray-500 mt-2">We couldn't process the image. Please try a clearer photo.</p>
                <button onClick={resetAnalysis} className="mt-6 text-primary-600 font-bold hover:underline">Try Again</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;