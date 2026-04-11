import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BertSentiment.css'; // Reusing common panel styles
import './FlowerVision.css';

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

const sampleImages = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12];

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
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [result]);

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
    } catch (err: any) {
      setError('Failed to process image.');
    } finally {
      setLoading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSampleClick = async (imgUrl: string) => {
    setSelectedImage(imgUrl);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const filename = imgUrl.split('/').pop() || 'sample.jpg';
      const file = new File([blob], filename, { type: 'image/jpeg' });

      const resizedFile = await resizeImage(file, 96);
      setFileToUpload(resizedFile);
      // We keep the original sample image for preview as it looks better than a 96x96 blown up image
      // but the fileToUpload is now 96x96
      setSelectedImage(imgUrl);
      await classifyImage(resizedFile); // Auto-classify (awaited)
    } catch (err: any) {
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

    const baseUrl = import.meta.env.DEV ? 'http://localhost:8000' : '';
    const endpoint = `${baseUrl}/api/cv/classify`;

    const formData = new FormData();
    formData.append('file', targetFile);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while classifying the image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="project-page-container">
      <Link to="/#projects" className="back-link">← Back to Home</Link>
      <div className="project-header">
        <h1 className="project-title">Flower Vision Classifier</h1>
        <p className="project-subtitle">Computer Vision Pipeline</p>
      </div>

      <div className="project-content">
        <div className="info-panel">
          <h3>About this Project</h3>
          <p>
            An end-to-end Computer Vision project combining image classification and generative AI.
          </p>
          <ul>
            <li><b>CNN Classifier:</b> Trained on the Oxford Flower dataset using PyTorch. Predicts the specific flower variety given an image. Achieved 81% accuracy on the 10-class dataset and 72% on the 102-class dataset.</li>
            <li><b>Latent Diffusion Model:</b> A generative AI implementation utilizing an autoencoder and U-Net denoising architecture to synthesize realistic flower images from noise (Demo Coming Soon).</li>
            <li><b>Real-time Inference:</b> The backend performs classification instantly via a REST API.</li>
          </ul>
        </div>

        <div className="demo-panel">
          <div className="samples-section">
            <span className="suggested-label" style={{ display: 'block', marginBottom: '1rem' }}>Try an example:</span>
            <div className="samples-grid">
              {sampleImages.map((imgUrl, index) => (
                <img
                  key={index}
                  src={imgUrl}
                  alt={`Sample ${index + 1}`}
                  className="sample-thumbnail"
                  onClick={() => handleSampleClick(imgUrl)}
                />
              ))}
            </div>
          </div>

          <div className="upload-section">
            <span className="suggested-label" style={{ alignSelf: 'flex-start', marginBottom: '1rem' }}>Or upload your own image:</span>
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
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              {selectedImage ? (
                <img src={selectedImage} alt="Selected" className="preview-image" />
              ) : (
                <div className="drop-zone-placeholder">
                  <span className="upload-icon">📸</span>
                  <p>Click to upload an image</p>
                  <p className="upload-subtext">JPG, PNG</p>
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

            {error && <div className="error-message" style={{ marginTop: '1rem', width: '100%' }}>{error}</div>}

            <div className="result-container" style={{ minHeight: result || loading ? '180px' : '0', transition: 'min-height 0.3s', width: '100%' }}>
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
                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                      <h3 className="prediction-class" style={{ opacity: 0.7 }}>PROCESSING...</h3>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowerVision;
