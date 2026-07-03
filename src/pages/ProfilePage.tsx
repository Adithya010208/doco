/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, Dispatch, SetStateAction, FormEvent } from 'react';
import { motion } from 'motion/react';
import { 
  User, Shield, Phone, Mail, Award, BookOpen, 
  MapPin, Clock, Edit2, Check, RefreshCw 
} from 'lucide-react';
import { Doctor } from '../types';

interface ProfilePageProps {
  doctor: Doctor;
  setDoctor: Dispatch<SetStateAction<Doctor>>;
}

export default function ProfilePage({ doctor, setDoctor }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(doctor.name);
  const [phone, setPhone] = useState(doctor.phone);
  const [bio, setBio] = useState(doctor.bio);
  const [hospital, setHospital] = useState(doctor.hospital);
  const [specialty, setSpecialty] = useState(doctor.specialty);

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    setDoctor(prev => ({
      ...prev,
      name,
      phone,
      bio,
      hospital,
      specialty
    }));
    setIsEditing(false);
  };

  const handleUpdateAvailability = (status: Doctor['availability']) => {
    setDoctor(prev => ({
      ...prev,
      availability: status
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Profile Banner */}
      <div className="bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent border border-blue-500/15 p-6 rounded-3xl relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-1/2 -translate-y-1/2 right-12 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl animate-pulse pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-5">
          {/* Avatar Ring with availability indicator */}
          <div className="relative">
            <img 
              src={doctor.avatar} 
              alt={doctor.name} 
              className={`w-24 h-24 rounded-full object-cover ring-4 ${
                doctor.availability === 'available'
                  ? 'ring-emerald-500'
                  : doctor.availability === 'busy'
                  ? 'ring-rose-500'
                  : doctor.availability === 'away'
                  ? 'ring-amber-500'
                  : 'ring-slate-500'
              } shadow-lg`}
            />
            <span className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-slate-50 dark:border-slate-900 ${
              doctor.availability === 'available'
                ? 'bg-emerald-500'
                : doctor.availability === 'busy'
                ? 'bg-rose-500'
                : doctor.availability === 'away'
                ? 'bg-amber-500'
                : 'bg-slate-500'
            }`} />
          </div>

          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white tracking-tight">{doctor.name}</h2>
            <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm">{doctor.specialty}</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1 justify-center sm:justify-start">
              <MapPin className="w-3.5 h-3.5" /> {doctor.hospital}
            </p>
          </div>
        </div>
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: General resume info */}
        <div className="space-y-6">
          
          {/* Availability Switchboard */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-950 dark:text-white tracking-tight uppercase">Presence Switchboard</h3>
              <p className="text-xs text-slate-500">Set availability for nurse dispatchers and emergency redirects</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { status: 'available', label: 'Available', color: 'bg-emerald-500 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
                { status: 'busy', label: 'In Surgery / Busy', color: 'bg-rose-500 text-rose-500 dark:text-rose-400 border-rose-500/20' },
                { status: 'away', label: 'On Break / Away', color: 'bg-amber-500 text-amber-500 dark:text-amber-400 border-amber-500/20' },
                { status: 'offline', label: 'Off Duty', color: 'bg-slate-500 text-slate-500 dark:text-slate-400 border-slate-500/20' }
              ].map((item) => (
                <button
                  key={item.status}
                  onClick={() => handleUpdateAvailability(item.status as any)}
                  className={`p-2.5 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 ${
                    doctor.availability === item.status
                      ? 'bg-blue-500/10 border-blue-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-100 dark:border-slate-800/40 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${doctor.availability === item.status ? 'bg-blue-600' : item.color.split(' ')[0]}`} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Credentials and Medals */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-950 dark:text-white uppercase tracking-wider">Clinical Board Accolades</h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex gap-2.5 items-start">
                <div className="p-1.5 bg-blue-500/10 text-blue-600 rounded-lg shrink-0 mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Board Certified Cardiologist</h4>
                  <p className="text-slate-500 text-[11px]">American Board of Internal Medicine, Cardiovascular Disease subspecialty.</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <div className="p-1.5 bg-blue-500/10 text-blue-600 rounded-lg shrink-0 mt-0.5">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Research Fellow • AHA</h4>
                  <p className="text-slate-500 text-[11px]">Published 14 clinical trial logs regarding mitral valve replacement therapy.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Resume bio form */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-950 dark:text-white tracking-tight">Clinical Registry Profile</h3>
              <p className="text-xs text-slate-500">Edit credentials shown to hospital databases and patients</p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition-all"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-name" className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Corporate Title Name</label>
                  <input
                    id="edit-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-900 dark:text-white focus:border-blue-600 outline-none transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="edit-specialty" className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Clinical Specialty</label>
                  <input
                    id="edit-specialty"
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-900 dark:text-white focus:border-blue-600 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-hospital" className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Medical Center</label>
                  <input
                    id="edit-hospital"
                    type="text"
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-900 dark:text-white focus:border-blue-600 outline-none transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="edit-phone" className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Clinic Telephone Number</label>
                  <input
                    id="edit-phone"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-900 dark:text-white focus:border-blue-600 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="edit-bio" className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Biography & Credentials Summary</label>
                <textarea
                  id="edit-bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-900 dark:text-white focus:border-blue-600 outline-none transition-all resize-none"
                />
              </div>

              <div className="flex gap-2.5">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1 shadow-md shadow-blue-500/10"
                >
                  <Check className="w-3.5 h-3.5" /> Commit Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              
              {/* Contact Grid layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium border-b border-slate-100 dark:border-slate-800 pb-5">
                <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                  <Mail className="w-4.5 h-4.5 text-blue-600" />
                  <div>
                    <span className="text-slate-400 block font-bold text-[9px] uppercase">Clinical Email</span>
                    <span className="font-bold">{doctor.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                  <Phone className="w-4.5 h-4.5 text-blue-600" />
                  <div>
                    <span className="text-slate-400 block font-bold text-[9px] uppercase">Clinic Phone</span>
                    <span className="font-bold">{doctor.phone}</span>
                  </div>
                </div>
              </div>

              {/* Bio summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Biography & Clinical Philosophy</h4>
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed font-medium">
                  {doctor.bio}
                </p>
              </div>

              {/* Quick statistics checklist */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px] font-mono text-slate-400">
                <span>Clinician ID: {doctor.id}</span>
                <span>Active Since: August 2014</span>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
