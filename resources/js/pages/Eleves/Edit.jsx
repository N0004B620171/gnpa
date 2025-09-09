import React, { useState } from "react";
import { useForm, Link } from "@inertiajs/react";

export default function Edit({ eleve }) {
  const { data, setData, put, processing, errors } = useForm({
    prenom: eleve.prenom || "",
    nom: eleve.nom || "",
    date_naissance: eleve.date_naissance || "",
    sexe: eleve.sexe || "",
    photo: null,
  });

  const [photoPreview, setPhotoPreview] = useState(eleve.photo_url || null);

  function handleSubmit(e) {
    e.preventDefault();
    put(route("eleves.update", eleve.id));
  }

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    setData("photo", file);
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(eleve.photo_url || null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <h1 className="text-2xl font-bold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Modifier l'élève
          </h1>
          <p className="text-blue-100 mt-1">Modifiez les informations de {eleve.prenom} {eleve.nom}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
              <div className="relative">
                <input
                  type="text"
                  value={data.prenom}
                  onChange={(e) => setData("prenom", e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg border ${errors.prenom ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                  placeholder="Entrez le prénom"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              {errors.prenom && <p className="mt-1 text-sm text-red-600">{errors.prenom}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <div className="relative">
                <input
                  type="text"
                  value={data.nom}
                  onChange={(e) => setData("nom", e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg border ${errors.nom ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                  placeholder="Entrez le nom"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              {errors.nom && <p className="mt-1 text-sm text-red-600">{errors.nom}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance *</label>
              <div className="relative">
                <input
                  type="date"
                  value={data.date_naissance}
                  onChange={(e) => setData("date_naissance", e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg border ${errors.date_naissance ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              {errors.date_naissance && <p className="mt-1 text-sm text-red-600">{errors.date_naissance}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sexe *</label>
              <div className="relative">
                <select
                  value={data.sexe}
                  onChange={(e) => setData("sexe", e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg border ${errors.sexe ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none`}
                >
                  <option value="">-- Choisir --</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-3 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </div>
              {errors.sexe && <p className="mt-1 text-sm text-red-600">{errors.sexe}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1">
                <div className={`border-2 border-dashed ${errors.photo ? 'border-red-500' : 'border-gray-300'} rounded-lg p-4 text-center transition-colors hover:border-blue-400 relative`}>
                  <input
                    type="file"
                    onChange={handlePhotoChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-medium text-blue-600">Cliquez pour changer la photo</span> ou glissez-déposez
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG jusqu'à 2MB</p>
                </div>
                {errors.photo && <p className="mt-1 text-sm text-red-600">{errors.photo}</p>}
              </div>
              
              {photoPreview && (
                <div className="md:w-1/3 flex flex-col items-center">
                  <p className="text-xs text-gray-500 text-center mb-2">Photo actuelle</p>
                  <div className="relative">
                    <img 
                      src={photoPreview} 
                      alt={`Photo de ${eleve.prenom} ${eleve.nom}`} 
                      className="h-32 w-32 object-cover rounded-md border"
                    />
                    {eleve.photo_url && (
                      <span className="absolute -top-2 -right-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        Actuelle
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200">
            <Link 
              href={route("eleves.index")}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour à la liste
            </Link>
            
            <div className="flex gap-3">
              <Link 
                href={route("eleves.show", eleve.id)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Voir détails
              </Link>
              
              <button 
                type="submit" 
                disabled={processing}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 transition-colors"
              >
                {processing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mise à jour...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Mettre à jour
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}