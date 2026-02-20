// frontend/src/components/cheques/ChequeUploadForm.tsx
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  Camera, 
  FileText, 
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  X,
  Edit3,
  Eye,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import FormField from './FormField';
import './ChequeUploadForm.css';

interface ChequeData {
  id?: number;
  chequeNumber: string;
  amount: string;
  amountWords: string;
  issueDate: string;
  dueDate: string;
  drawerName: string;
  beneficiaryName: string;
  bankName: string;
  rib: string;
  iban: string;
  confidence: {
    chequeNumber: number;
    amount: number;
    amountWords: number;
    issueDate: number;
    dueDate: number;
    drawerName: number;
    beneficiaryName: number;
    bankName: number;
    rib: number;
    iban: number;
  };
}

const ChequeUploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'form' | 'preview'>('upload');
  
  const [formData, setFormData] = useState<ChequeData>({
    chequeNumber: '',
    amount: '',
    amountWords: '',
    issueDate: '',
    dueDate: '',
    drawerName: '',
    beneficiaryName: '',
    bankName: '',
    rib: '',
    iban: '',
    confidence: {
      chequeNumber: 0,
      amount: 0,
      amountWords: 0,
      issueDate: 0,
      dueDate: 0,
      drawerName: 0,
      beneficiaryName: 0,
      bankName: 0,
      rib: 0,
      iban: 0
    }
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setFile(file);
    setPreview(URL.createObjectURL(file));
    setActiveTab('preview');
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxSize: 10485760,
    maxFiles: 1
  });

  const processCheque = async () => {
    if (!file) return;

    setProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append('cheque', file);

    try {
      const response = await api.post('/cheques/process', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const data = response.data;
      
      setFormData({
        chequeNumber: data.chequeNumber || '',
        amount: data.amount || '',
        amountWords: data.amountWords || '',
        issueDate: data.issueDate || '',
        dueDate: data.dueDate || '',
        drawerName: data.drawerName || '',
        beneficiaryName: data.beneficiaryName || '',
        bankName: data.bankName || '',
        rib: data.rib || '',
        iban: data.iban || '',
        confidence: data.confidence || {
          chequeNumber: 0,
          amount: 0,
          amountWords: 0,
          issueDate: 0,
          dueDate: 0,
          drawerName: 0,
          beneficiaryName: 0,
          bankName: 0,
          rib: 0,
          iban: 0
        }
      });

      setActiveTab('form');
    } catch (err) {
      setError('Erreur lors du traitement OCR. Veuillez réessayer.');
      console.error('OCR error:', err);
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post('/cheques/save', formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
      console.error('Save error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ChequeData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFormData({
      chequeNumber: '',
      amount: '',
      amountWords: '',
      issueDate: '',
      dueDate: '',
      drawerName: '',
      beneficiaryName: '',
      bankName: '',
      rib: '',
      iban: '',
      confidence: {
        chequeNumber: 0,
        amount: 0,
        amountWords: 0,
        issueDate: 0,
        dueDate: 0,
        drawerName: 0,
        beneficiaryName: 0,
        bankName: 0,
        rib: 0,
        iban: 0
      }
    });
    setActiveTab('upload');
    setError(null);
  };

  const reliableFieldsCount = Object.values(formData.confidence).filter(s => s >= 70).length;

  return (
    <div className="cheque-upload-container">
      {/* Navigation */}
      <nav className="nav-bar">
        <div className="nav-content">
          <Link to="/dashboard" className="back-link">
            <ArrowLeft className="icon-sm" />
            Retour au tableau de bord
          </Link>
          <span className="nav-title">Scan de chèque</span>
        </div>
      </nav>

      <div className="main-content">
        {/* En-tête */}
        <div className="header">
          <h1 className="title">Scanner un chèque</h1>
          <p className="subtitle">
            Importez l'image du chèque pour remplir automatiquement le formulaire
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="message error">
            <AlertCircle className="icon-sm" />
            {error}
          </div>
        )}

        {success && (
          <div className="message success">
            <CheckCircle className="icon-sm" />
            Chèque enregistré avec succès !
          </div>
        )}

        {/* Tabs */}
        <div className="tabs">
          <button
            onClick={() => setActiveTab('upload')}
            className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
          >
            <Upload className="icon-sm" />
            <span>1. Upload</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            disabled={!file}
            className={`tab ${activeTab === 'preview' ? 'active' : ''} ${!file ? 'disabled' : ''}`}
          >
            <Eye className="icon-sm" />
            <span>2. Prévisualisation</span>
          </button>
          <button
            onClick={() => setActiveTab('form')}
            disabled={!file}
            className={`tab ${activeTab === 'form' ? 'active' : ''} ${!file ? 'disabled' : ''}`}
          >
            <Edit3 className="icon-sm" />
            <span>3. Saisie</span>
          </button>
        </div>

        <div className="grid-layout">
          {/* Colonne gauche */}
          <div className="left-column">
            {activeTab === 'upload' && (
              <div
                {...getRootProps()}
                className={`dropzone ${isDragActive ? 'drag-active' : ''}`}
              >
                <input {...getInputProps()} />
                
                <div className="dropzone-content">
                  <div className={`dropzone-icon ${isDragActive ? 'active' : ''}`}>
                    <Camera className="icon-lg" />
                  </div>
                  
                  <h3 className="dropzone-title">
                    {isDragActive ? 'Déposez le chèque ici' : 'Glissez le chèque ici'}
                  </h3>
                  
                  <p className="dropzone-text">
                    ou cliquez pour parcourir
                  </p>
                  
                  <div className="dropzone-hint">
                    <span>PNG, JPG, PDF</span>
                    <span>•</span>
                    <span>Max 10MB</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preview' && preview && (
              <div className="preview-card">
                <div className="preview-header">
                  <div className="preview-title">
                    <FileText className="icon-sm" />
                    <span>{file?.name}</span>
                  </div>
                  <button onClick={resetForm} className="close-button">
                    <X className="icon-sm" />
                  </button>
                </div>
                
                <div className="preview-image-container">
                  <img
                    src={preview}
                    alt="Aperçu du chèque"
                    className="preview-image"
                  />
                </div>

                <div className="preview-footer">
                  <button
                    onClick={processCheque}
                    disabled={processing}
                    className="process-button"
                  >
                    {processing ? (
                      <>
                        <RefreshCw className="icon-sm spin" />
                        Traitement OCR en cours...
                      </>
                    ) : (
                      <>
                        <Camera className="icon-sm" />
                        Lancer l'analyse automatique
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Colonne droite */}
          <div className="right-column">
            <div className="form-card">
              <h2 className="form-title">
                <Edit3 className="icon-md" />
                Informations du chèque
                {activeTab === 'form' && (
                  <span className="confidence-badge">
                    {reliableFieldsCount}/10 champs fiables
                  </span>
                )}
              </h2>

              <form onSubmit={handleSubmit} className="form">
                <FormField
                  label="Numéro de chèque"
                  value={formData.chequeNumber}
                  onChange={(val) => handleChange('chequeNumber', val)}
                  confidence={formData.confidence.chequeNumber}
                  required
                  placeholder="123456789"
                />

                <FormField
                  label="Montant (TND)"
                  value={formData.amount}
                  onChange={(val) => handleChange('amount', val)}
                  confidence={formData.confidence.amount}
                  required
                  type="number"
                  step="0.001"
                  placeholder="1500.500"
                />

                <FormField
                  label="Montant en lettres"
                  value={formData.amountWords}
                  onChange={(val) => handleChange('amountWords', val)}
                  confidence={formData.confidence.amountWords}
                  required
                  placeholder="Mille cinq cents dinars"
                  multiline
                />

                <div className="grid-2">
                  <FormField
                    label="Date d'émission"
                    value={formData.issueDate}
                    onChange={(val) => handleChange('issueDate', val)}
                    confidence={formData.confidence.issueDate}
                    required
                    type="date"
                  />
                  <FormField
                    label="Date d'échéance"
                    value={formData.dueDate}
                    onChange={(val) => handleChange('dueDate', val)}
                    confidence={formData.confidence.dueDate}
                    type="date"
                  />
                </div>

                <div className="grid-2">
                  <FormField
                    label="Tireur (Émetteur)"
                    value={formData.drawerName}
                    onChange={(val) => handleChange('drawerName', val)}
                    confidence={formData.confidence.drawerName}
                    required
                    placeholder="Nom du tireur"
                  />
                  <FormField
                    label="Bénéficiaire"
                    value={formData.beneficiaryName}
                    onChange={(val) => handleChange('beneficiaryName', val)}
                    confidence={formData.confidence.beneficiaryName}
                    required
                    placeholder="Nom du bénéficiaire"
                  />
                </div>

                <FormField
                  label="Banque émettrice"
                  value={formData.bankName}
                  onChange={(val) => handleChange('bankName', val)}
                  confidence={formData.confidence.bankName}
                  required
                  placeholder="BIAT, ATB, BH, etc."
                />

                <div className="grid-2">
                  <FormField
                    label="RIB"
                    value={formData.rib}
                    onChange={(val) => handleChange('rib', val)}
                    confidence={formData.confidence.rib}
                    placeholder="12345678901234567890"
                  />
                  <FormField
                    label="IBAN"
                    value={formData.iban}
                    onChange={(val) => handleChange('iban', val)}
                    confidence={formData.confidence.iban}
                    placeholder="TN59 1234 5678 9012 3456 7890"
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="button-secondary"
                  >
                    Nouveau chèque
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="button-primary"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="icon-sm spin" />
                        Sauvegarde...
                      </>
                    ) : (
                      <>
                        <Save className="icon-sm" />
                        Enregistrer le chèque
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChequeUploadForm;