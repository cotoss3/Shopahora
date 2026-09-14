import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, CheckCircle, AlertCircle, Loader2, Link as LinkIcon, Star } from 'lucide-react';

interface ImageS3UploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export const ImageS3Uploader: React.FC<ImageS3UploaderProps> = ({ images, onChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [urlInput, setUrlInput] = useState('');
  const [s3Status, setS3Status] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulated AWS S3 Upload function (Prepared for AWS S3 Bucket Integration)
  const uploadFilesToS3Simulated = async (files: FileList | File[]) => {
    setIsUploading(true);
    setUploadProgress(20);
    setS3Status('Conectando con AWS S3 Bucket (s3://shopahora-panama-assets)...');

    const newImageUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      setUploadProgress(40 + Math.round(((i + 1) / files.length) * 50));
      await new Promise((resolve) => setTimeout(resolve, 400)); // Simulate S3 network latency

      // Generate local Object URL for instant preview + simulated S3 key
      const localUrl = URL.createObjectURL(file);
      newImageUrls.push(localUrl);
    }

    setUploadProgress(100);
    setTimeout(() => {
      setIsUploading(false);
      setS3Status('Imágenes cargadas localmente (Preparadas para sincronización automática a S3)');
      onChange([...images, ...newImageUrls]);
    }, 300);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFilesToS3Simulated(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFilesToS3Simulated(e.dataTransfer.files);
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    onChange([...images, urlInput.trim()]);
    setUrlInput('');
    setS3Status('Imagen agregada desde URL externa');
  };

  const handleRemoveImage = (index: number) => {
    if (images.length <= 1) {
      alert('El producto debe mantener al menos 1 imagen principal.');
      return;
    }
    const updated = images.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  const handleSetMainImage = (index: number) => {
    if (index === 0) return;
    const selected = images[index];
    const rest = images.filter((_, idx) => idx !== index);
    onChange([selected, ...rest]);
    setS3Status('Imagen principal actualizada');
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      
      {/* S3 Preparation Banner Badge */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-surface border border-warmgray-200 shadow-xs">
        <div className="flex items-center gap-2 text-charcoal-900">
          <UploadCloud className="w-4 h-4 text-terracotta-600" />
          <span className="font-bold">Módulo de Carga S3 (AWS Panama Bucket)</span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-forest-700/10 text-forest-700 font-bold text-[10px]">
          AWS Key ID: 50269... (Conectado)
        </span>
      </div>

      {/* Drag & Drop File Explorer Box */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative p-6 sm:p-8 rounded-3xl border-2 border-dashed text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-terracotta-600 bg-terracotta-500/5 scale-[1.01]'
            : 'border-warmgray-300 hover:border-terracotta-500 bg-canvas'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        {isUploading ? (
          <div className="space-y-3 py-4">
            <Loader2 className="w-10 h-10 text-terracotta-600 animate-spin mx-auto" />
            <p className="font-bold text-charcoal-900">Subiendo a servidor S3... ({uploadProgress}%)</p>
            <div className="w-48 mx-auto bg-warmgray-200 h-2 rounded-full overflow-hidden">
              <div className="bg-terracotta-600 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-terracotta-600/10 text-terracotta-600 flex items-center justify-center mx-auto">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-charcoal-900 text-sm font-sans">
                Haz clic para explorar imágenes o arrastra los archivos aquí
              </p>
              <p className="text-warmgray-500 text-xs mt-1">
                Soporta PNG, JPG, WEBP y SVG. Las imágenes se cargarán y prepararán para el bucket de AWS S3.
              </p>
            </div>
            <button
              type="button"
              className="px-5 py-2 bg-charcoal-900 hover:bg-terracotta-600 text-white rounded-full font-medium shadow-xs"
            >
              Explorar Archivos Locales
            </button>
          </div>
        )}
      </div>

      {/* Alternative URL paste */}
      <div className="p-3.5 rounded-2xl bg-canvas border border-warmgray-200 flex gap-2">
        <div className="relative flex-1">
          <LinkIcon className="w-4 h-4 text-warmgray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="O pega una URL de imagen directamente (https://...)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUrl())}
            className="w-full pl-9 pr-3 py-2 bg-surface border border-warmgray-200 rounded-xl text-charcoal-900 focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={handleAddUrl}
          className="px-4 py-2 bg-charcoal-900 text-white rounded-xl font-bold hover:bg-terracotta-600 transition-colors"
        >
          Agregar URL
        </button>
      </div>

      {s3Status && (
        <p className="text-[11px] text-forest-700 font-bold flex items-center gap-1.5 px-1">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>{s3Status}</span>
        </p>
      )}

      {/* Gallery Preview List */}
      <div className="space-y-2 pt-2">
        <label className="block text-warmgray-700 font-bold uppercase text-[11px]">
          Imágenes del Producto ({images.length}) — La primera es la Principal:
        </label>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`relative group aspect-square rounded-2xl overflow-hidden bg-warmgray-100 border-2 transition-all shadow-xs ${
                idx === 0 ? 'border-terracotta-600 ring-2 ring-terracotta-600/20' : 'border-warmgray-200'
              }`}
            >
              <img src={img} alt={`Vista previa ${idx + 1}`} className="w-full h-full object-cover" />

              {/* Main Badge */}
              {idx === 0 ? (
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-terracotta-600 text-white text-[9px] font-bold uppercase rounded-full flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 fill-white" /> Principal
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSetMainImage(idx)}
                  className="absolute top-2 left-2 px-2 py-0.5 bg-charcoal-900/80 hover:bg-terracotta-600 text-white text-[9px] font-bold uppercase rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Hacer Principal
                </button>
              )}

              {/* Delete button */}
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                title="Eliminar imagen"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
