"use client";
import React, { useState, useRef, useEffect } from 'react';
import NextImage from 'next/image';
import type { StaticImageData } from 'next/image';

// Styles are imported once in src/app/layout.tsx as global CSS

import img1 from '../assets/sample_flower_images/image_01209.jpg';
import img2 from '../assets/sample_flower_images/image_02196.jpg';
import img3 from '../assets/sample_flower_images/image_03585.jpg';
import img4 from '../assets/sample_flower_images/image_03670.jpg';
import img5 from '../assets/sample_flower_images/image_06683.jpg';
import img6 from '../assets/sample_flower_images/image_06745.jpg';
import img7 from '../assets/sample_flower_images/image_07214.jpg';
import img8 from '../assets/sample_flower_images/image_07329.jpg';
import img9 from '../assets/sample_flower_images/image_07651.jpg';
import img10 from '../assets/sample_flower_images/image_07839.jpg';
import img11 from '../assets/sample_flower_images/image_07897.jpg';
import img12 from '../assets/sample_flower_images/image_08183.jpg';

const sampleImages: (string | StaticImageData)[] = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
  img12,
];

type PredictionResult = {
  filename: string;
  prediction_index: number;
  prediction_class: string;
  model_type: string;
  confidence: number;
};



const FlowerVision: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCvInitializing, setIsCvInitializing] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<'classifier' | 'generator'>('classifier');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [diffusionStage, setDiffusionStage] = useState<'idle' | 'preparing' | 'noise' | 'diffusing' | 'generated'>('idle');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // const isDev = process.env.NODE_ENV === 'development'; // Use Modal even in dev
  // const baseUrl = isDev ? 'http://localhost:8000' : ''; //'https://shjy2015--flower-vision-api-web-app.modal.run';
  // const baseUrl = isDev ? 'https://shjy2015--flower-vision-api-web-app.modal.run' : '';
  const baseUrl = ''; // Always use relative URL, let proxy handle it

  const hasFetchedHealth = useRef(false);

  useEffect(() => {
    if (hasFetchedHealth.current) return;
    hasFetchedHealth.current = true;

    // Trigger cold start on load
    fetch(`${baseUrl}/api/cv/health`)
      .then(async (response) => {
        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          setIsCvInitializing(payload?.code === 'MODEL_INITIALIZING');
          return;
        }

        setIsCvInitializing(false);
      })
      .catch(() => {
        setIsCvInitializing(true);
      });
  }, [baseUrl]);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [result]);

  useEffect(() => {
    if (generatedImageUrl) {
      setDiffusionStage('noise');

      const timer1 = setTimeout(() => setDiffusionStage('diffusing'), 1000);
      const timer2 = setTimeout(() => {
        setDiffusionStage('generated');
      }, 5500); // Adjust this (ms) to match total animation duration (steps * 500ms)

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [generatedImageUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
      // Reset input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const resizeImage = (file: File, size: number): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          // Center Crop Logic
          const sourceWidth = img.width;
          const sourceHeight = img.height;
          const minSide = Math.min(sourceWidth, sourceHeight);
          const sourceX = (sourceWidth - minSide) / 2;
          const sourceY = (sourceHeight - minSide) / 2;

          ctx.drawImage(
            img,
            sourceX, sourceY, minSide, minSide, // Source (center crop)
            0, 0, size, size // Destination (resize)
          );

          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: 'image/jpeg' }));
            } else {
              reject(new Error('Canvas toBlob failed'));
            }
          }, 'image/jpeg', 0.95);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const resizedFile = await resizeImage(file, 96);
      setFileToUpload(resizedFile);
      setSelectedImage(URL.createObjectURL(file));
      await classifyImage(resizedFile); // Auto-classify (awaited)
    } catch (err: unknown) {
      console.error('Failed to process image:', err);
      setError('Failed to process image.');
    } finally {
      setLoading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragging(true);
  };

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    console.log('Drop event detected');

    // Check for dropped files (from desktop)
    const file = e.dataTransfer.files?.[0];
    if (file) {
      console.log('File dropped:', file.name);
      processFile(file);
      return;
    }

    // Check for dropped URLs (from within the page or other tabs)
    // Try multiple formats for compatibility
    const urlData = e.dataTransfer.getData('text/uri-list') ||
      e.dataTransfer.getData('text/plain') ||
      e.dataTransfer.getData('URL');

    if (urlData) {
      console.log('URL dropped:', urlData);
      // text/uri-list can contain multiple URLs, take the first one
      const cleanUrl = urlData.split('\n')[0].trim();
      handleSampleClick(cleanUrl);
    } else {
      console.log('No usable drop data found');
    }
  };

  const handleSampleClick = async (imgUrl: string | StaticImageData) => {
    const url = typeof imgUrl === 'string' ? imgUrl : imgUrl.src;
    setSelectedImage(url);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const filename = url.split('/').pop() || 'sample.jpg';
      const file = new File([blob], filename, { type: 'image/jpeg' });

      const resizedFile = await resizeImage(file, 96);
      setFileToUpload(resizedFile);
      // We keep the original sample image for preview as it looks better than a 96x96 blown up image
      // but the fileToUpload is now 96x96
      setSelectedImage(url);
      await classifyImage(resizedFile); // Auto-classify (awaited)
    } catch (err: unknown) {
      console.error('Failed to load sample image:', err);
      setError('Failed to load sample image.');
    } finally {
      setLoading(false);
    }
  };

  const classifyImage = async (file?: File) => {
    const targetFile = file || fileToUpload;
    if (!targetFile) return;

    setLoading(true);
    setError(null);

    const endpoint = `${baseUrl}/api/cv/classify`;

    const formData = new FormData();
    formData.append('file', targetFile);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        if (payload?.code === 'MODEL_INITIALIZING') {
          setIsCvInitializing(true);
          throw new Error(payload.message);
        }

        throw new Error(payload?.message || payload?.error || `API Error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      setIsCvInitializing(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred while classifying the image.');
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async (format: 'gif' | 'jpeg', batchSize: number = 1) => {
    setIsGenerating(true);
    setGenerationError(null);
    setGeneratedImageUrl(null); // Clear previous image
    setDiffusionStage('preparing');

    const endpoint = `${baseUrl}/api/cv/generate?format=${format}&batch_size=${batchSize}`;

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      setGeneratedImageUrl(objectUrl);
    } catch (err: any) {
      setGenerationError(err.message || 'An error occurred while generating the image.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getDiffusionDescription = () => {
    switch (diffusionStage) {
      case 'preparing': return "Initializing...";
      case 'noise': return "Noise...";
      case 'diffusing': return "Denoising...";
      case 'generated': return "Generation complete.";
      default: return "Watch our custom U-Net denoise random Gaussian noise into a flower over multiple diffusion steps.";
    }
  };

  const handleTabChange = (tab: 'classifier' | 'generator') => {
    setActiveTab(tab);
    if (tab === 'generator' && !generatedImageUrl && !isGenerating) {
      generateImage('gif', 4);
    }
  };

  return (
    <div className="project-container">
      <div className="project-content">
        <div className="info-panel">
          <h3>About this Project</h3>
          <p>
            An end-to-end Computer Vision project combining image classification and generative AI.
          </p>
          <ul>
            <li><b>Image Classifier:</b> A PyTorch-based CNN with 0.8M parameters trained on the Oxford Flower dataset. Utilize data augmentation (flip, rotate, colour jitter) and regularization (batch norm, dropout, weight decay) to prevent overfitting. Increased accuracy from <b>66%</b> to <b>81%</b> on the 10-class (coarse-grained) dataset and <b>72%</b> on the 102-class (fine-grained) dataset.</li>
            <li><b>Image Generator:</b> A latent diffusion system including a 15.9M U-NET denoising model and an autoencoder to generate 96 x 96 flower images from pure random noise over 10 iterative denoising steps.</li>
            <li><b>Real-time Inference:</b> The backend performs classification and generation via a REST API with FastAPI, deployed on Modal's serverless GPU infrastructure.</li>
          </ul>
        </div>

        <div className="demo-panel">
          <div className="demo-tabs">
            <button
              className={`demo-tab ${activeTab === 'classifier' ? 'active' : ''}`}
              onClick={() => handleTabChange('classifier')}
            >
              Classification
            </button>
            <button
              className={`demo-tab ${activeTab === 'generator' ? 'active' : ''}`}
              onClick={() => handleTabChange('generator')}
            >
              Generative AI
            </button>
          </div>

          {activeTab === 'classifier' && (
            <div className="classifier-section">
              <div className="samples-section">
                <span className="suggested-label" style={{ display: 'block', marginBottom: '1rem', fontSize: '1.1rem' }}>Try an example:</span>
                <div className="samples-grid">
                  {sampleImages.map((imgUrl, index) => (
                    <NextImage
                      key={index}
                      src={imgUrl}
                      alt={`Sample ${index + 1}`}
                      className="sample-thumbnail"
                      width={96}
                      height={96}
                      onClick={() => handleSampleClick(imgUrl)}
                      onDragStart={(e) => {
                        const url = typeof imgUrl === 'string' ? imgUrl : (imgUrl as StaticImageData).src;
                        e.dataTransfer.setData('text/plain', url);
                        e.dataTransfer.dropEffect = 'copy';
                      }}
                      draggable
                    />
                  ))}
                </div>
              </div>

              <div className="upload-section">
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />

                <div
                  className={`drop-zone ${isDragging ? 'dragging' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={onDragOver}
                  onDragEnter={onDragEnter}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                >
                  {selectedImage ? (
                    <img src={selectedImage} alt="Selected" className="preview-image" />
                  ) : (
                    <div className="drop-zone-placeholder">
                      <span className="upload-icon">📸</span>
                      <p>Click or drag to classify</p>
                    </div>
                  )}
                </div>

                <button
                  className="primary-button"
                  onClick={() => classifyImage()}
                  disabled={loading || !fileToUpload}
                  style={{ width: '100%', marginTop: '1rem' }}
                >
                  {loading ? 'Classifying...' : 'Classify Image'}
                </button>

                {isCvInitializing && !loading && (
                  <div className="status-message" style={{ marginTop: '1rem', width: '100%' }}>
                    The computer vision model is initializing. This can take a few seconds during a cold start.
                  </div>
                )}

                {error && <div className="error-message" style={{ marginTop: '1rem', width: '100%' }}>{error}</div>}

                <div className="result-container" style={{ minHeight: result || loading ? '60px' : '0', transition: 'min-height 0.3s', width: '100%' }}>
                  {(result || loading) && (
                    <div
                      ref={resultRef}
                      className={`result-box cv-result ${loading ? 'loading-pulse' : 'positive'}`}
                      style={{ position: 'relative', overflow: 'hidden' }}
                    >
                      {result ? (
                        <div style={{ transition: 'opacity 0.3s' }}>
                          <h3 className="prediction-class">{result.prediction_class.replace(/_/g, ' ').toUpperCase()}</h3>
                          <div className="prediction-details">
                            <div className="detail-item">
                              <span className="detail-label">Confidence</span>
                              <span className="detail-value">{(result.confidence * 100).toFixed(2)}%</span>
                            </div>
                          </div>
                        </div>
                      ) : loading ? (
                        <div style={{ padding: '1rem', textAlign: 'center' }}>
                          <h3 className="prediction-class" style={{ opacity: 0.7 }}>
                            {isCvInitializing ? 'INITIALIZING...' : 'PROCESSING...'}
                          </h3>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'generator' && (
            <div className="generator-section">
              <p className={`generator-description stage-${diffusionStage}`}>
                {getDiffusionDescription()}
              </p>

              <div className="generation-display">
                {generatedImageUrl ? (
                  <img
                    src={generatedImageUrl}
                    alt="Generated Flower"
                    className="generated-image"
                  />
                ) : isGenerating ? (
                  <div className="loading-pulse generator-placeholder">
                    Generating 4 Flowers...
                  </div>
                ) : (
                  <div className="generator-placeholder">
                    <span className="upload-icon" style={{ filter: 'hue-rotate(90deg)' }}>🌸</span>
                    <p style={{ marginTop: '1rem' }}>{generationError ? 'Generation Failed' : 'Ready'}</p>
                  </div>
                )}
              </div>

              <div className="generator-actions">
                <button
                  className="primary-button"
                  onClick={() => generateImage('gif', 4)}
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Generating...' : 'Regenerate'}
                </button>
              </div>
              {generationError && <div className="error-message" style={{ marginTop: '1rem', width: '100%', textAlign: 'center' }}>{generationError}</div>}
            </div>
          )}
        </div>
      </div>
    </div >
  );
};

export default FlowerVision;
