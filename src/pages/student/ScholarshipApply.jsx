import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { 
  CheckCircle, ChevronRight, ChevronLeft, Upload, FileText, 
  Camera, Landmark, User, GraduationCap, ShieldCheck, 
  AlertCircle, Download, Save, Send, Sparkles
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function ScholarshipApply() {
  const { t, language } = useLanguage()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [appId, setAppId] = useState('')

  const [form, setForm] = useState({
    program_id: '',
    full_name: '',
    dob: '',
    gender: 'male',
    category: 'general',
    father_name: '',
    mother_name: '',
    annual_income: '',
    current_class: '',
    school_name: '',
    previous_marks: '',
    bank_name: '',
    account_holder: '',
    account_number: '',
    ifsc: '',
    declaration: false
  })

  // Document Upload State
  const [docFiles, setDocFiles] = useState({
    photo: null,
    aadhaar: null,
    income: null,
    marksheet: null
  })
  const [uploading, setUploading] = useState(false)

  const categories = [
    { id: 'scholarship', title: t('Scholarships'), subtitle: t('Financial aid for tuition'), icon: <Landmark size={24} />, color: '#FF6B35' },
    { id: 'mentorship', title: t('Mentorship'), subtitle: t('Guidance from professionals'), icon: <User size={24} />, color: '#2D5016' },
    { id: 'material', title: t('Study Material'), subtitle: t('Books and digital resources'), icon: <FileText size={24} />, color: '#FF6B35' },
    { id: 'test_series', title: t('Test Series'), subtitle: t('Exam preparation kits'), icon: <CheckCircle size={24} />, color: '#2D5016' }
  ]

  const scholarshipList = [
    { id: '1', name: 'DVS High School Merit', group: 'Class 9-10', amount: '₹12,000/year', cat: 'scholarship' },
    { id: '2', name: 'Girls Empowerment Grant', group: 'Female Students', amount: '₹15,000/year', cat: 'scholarship' },
    { id: '3', name: 'UPSC Mentorship Program', group: 'Aspirants', amount: 'Free', cat: 'mentorship' },
    { id: '4', name: 'Digital Library Access', group: 'All Students', amount: 'Free', cat: 'material' }
  ]

  const nextStep = () => setStep(s => Math.min(s + 1, 4))
  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  const handleFileChange = (key, file) => {
    if (file && file.size > 5 * 1024 * 1024) {
      alert(t('File size must be less than 5MB'))
      return
    }
    setDocFiles(prev => ({ ...prev, [key]: file }))
  }

  const uploadDocuments = async (applicationId) => {
    const uploadedDocs = []
    
    for (const [key, file] of Object.entries(docFiles)) {
      if (!file) continue
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${applicationId}/${key}_${Date.now()}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('scholarships')
        .upload(fileName, file)

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('scholarships')
        .getPublicUrl(fileName)

      uploadedDocs.push({
        application_id: applicationId,
        doc_type: key === 'income' ? 'income_cert' : key,
        file_url: publicUrl,
        file_name: file.name,
        file_size: file.size
      })
    }
    return uploadedDocs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return
    
    // Validate documents
    if (!docFiles.photo || !docFiles.aadhaar || !docFiles.income || !docFiles.marksheet) {
      alert(t('Please upload all required documents'))
      setStep(3)
      return
    }

    setLoading(true)
    setUploading(true)

    try {
      const generatedId = `DVS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
      
      // 1. Submit Application
      const { data: appData, error: submitError } = await supabase
        .from('scholarship_applications')
        .insert([{
          application_number: generatedId,
          student_id: user.id,
          program_id: form.program_id,
          personal_info: {
            full_name: form.full_name,
            dob: form.dob,
            father_name: form.father_name,
            mother_name: form.mother_name,
            annual_income: form.annual_income,
            current_class: form.current_class,
            school_name: form.school_name,
            previous_marks: form.previous_marks
          },
          bank_details: {
            bank_name: form.bank_name,
            account_holder: form.account_holder,
            account_number: form.account_number,
            ifsc: form.ifsc
          },
          status: 'submitted',
          declaration_accepted: form.declaration,
          submitted_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (submitError) throw submitError

      // 2. Upload Documents and Link to Application
      const docsToInsert = await uploadDocuments(appData.id)
      if (docsToInsert.length > 0) {
        const { error: docError } = await supabase
          .from('application_documents')
          .insert(docsToInsert)
        if (docError) throw docError
      }

      // 3. Award 50 Points for Scholarship Application
      await supabase.from('gamification_points').insert([
        { 
          user_id: user.id, 
          action: 'scholarship_apply', 
          points: 50, 
          description: `Applied for scholarship ${generatedId}` 
        }
      ])

      setAppId(generatedId)
      setSuccess(true)
    } catch (error) {
      console.error('Submission failed:', error)
      alert(t('Error submitting application. Please try again.'))
    } finally {
      setLoading(false)
      setUploading(false)
    }
  }

  if (success) {
    return (
      <div style={{ maxWidth: 600, margin: '100px auto', textAlign: 'center', background: 'white', padding: 60, borderRadius: 24, boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
        <div style={{ width: 80, height: 80, background: '#ecfdf5', borderRadius: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <CheckCircle size={48} color="#10b981" />
        </div>
        <h1 className="hindi" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111', marginBottom: 12 }}>{t('Submission Successful!')}</h1>
        <p className="hindi" style={{ color: '#64748b', marginBottom: 32 }}>{t('Your application has been received and is currently under review by our scholarship committee.')}</p>
        
        <div style={{ background: '#f8fafc', padding: '24px', borderRadius: 16, marginBottom: 32, textAlign: 'left' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
             <span className="hindi" style={{ color: '#64748b', fontSize: '0.85rem' }}>{t('Application ID')}</span>
             <span style={{ fontWeight: 800, color: '#111' }}>{appId}</span>
           </div>
           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
             <span className="hindi" style={{ color: '#64748b', fontSize: '0.85rem' }}>{t('Expected Outcome')}</span>
             <span className="hindi" style={{ fontWeight: 800, color: '#1d4ed8' }}>{t('15 Working Days')}</span>
           </div>
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
           <button style={{ flex: 1, padding: '14px', borderRadius: 12, border: '1px solid #e2e8f0', background: 'white', fontWeight: 700, color: '#111', cursor: 'pointer' }}>{t('Download Receipt')}</button>
           <button onClick={() => window.location.href='/student/dashboard'} style={{ flex: 1, padding: '14px', borderRadius: 12, border: 'none', background: '#111', fontWeight: 700, color: 'white', cursor: 'pointer' }}>{t('Go to Dashboard')}</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1000, margin: '40px auto', padding: '0 24px' }}>
      
      {/* Visual Step Indicator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 48, position: 'relative' }}>
        <div className="stepper-line" style={{ position: 'absolute', top: 22, left: '5%', right: '5%', height: 2, background: '#e2e8f0', zIndex: 1 }}>
           <div style={{ width: `${(step - 1) / 3 * 100}%`, height: '100%', background: '#FF6B35', transition: 'all 0.5s' }}></div>
        </div>
        {[1, 2, 3, 4].map(s => (
          <div key={s} style={{ position: 'relative', z_index: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ 
              width: 44, height: 44, borderRadius: '50%', background: step >= s ? '#FF6B35' : 'white', 
              border: '2px solid', borderColor: step >= s ? '#FF6B35' : '#e2e8f0',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: step >= s ? 'white' : '#94a3b8',
              fontWeight: 800, fontSize: '0.9rem', transition: 'all 0.3s',
              boxShadow: step === s ? '0 0 15px rgba(255, 107, 53, 0.4)' : 'none'
            }}>
              {step > s ? <CheckCircle size={20} /> : s}
            </div>
            <span className="hindi stepper-label" style={{ fontSize: '0.75rem', fontWeight: 800, color: step >= s ? '#111' : '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>
               {t(['Program', 'Academic', 'Documents', 'Review'][s-1])}
            </span>
          </div>
        ))}
      </div>

      <div className="form-container" style={{ background: 'white', borderRadius: 24, border: '1px solid #e2e8f0', padding: 48, boxShadow: '0 4px 30px rgba(0,0,0,0.02)' }}>
        
        {step === 1 && (
          <div>
            <h2 className="hindi" style={{ fontSize: '1.75rem', fontWeight: 900, color: '#111', marginBottom: 12 }}>{t('What assistance do you need?')}</h2>
            <p className="hindi" style={{ color: '#64748b', marginBottom: 32 }}>{t('Select a category to see available scholarship programs.')}</p>
            
            <div className="grid grid-2" style={{ gap: 16, marginBottom: 40 }}>
               {categories.map(c => (
                 <div key={c.id} style={{ padding: '24px', borderRadius: 20, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', gap: 16, alignItems: 'center' }} onMouseEnter={e => e.currentTarget.style.borderColor = c.color}>
                    <div style={{ width: 56, height: 56, background: `${c.color}10`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color }}>{c.icon || <Sparkles />}</div>
                    <div>
                       <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{c.title}</div>
                       <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{c.subtitle}</div>
                    </div>
                 </div>
               ))}
            </div>

            <h3 className="hindi" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111', marginBottom: 20 }}>{t('Available Programs')}</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              {scholarshipList.map(p => (
                <div key={p.id} onClick={() => setForm({...form, program_id: p.id})} style={{ padding: '20px', borderRadius: 16, border: '2px solid', borderColor: form.program_id === p.id ? '#FF6B35' : '#f1f5f9', background: form.program_id === p.id ? '#fff7ed' : 'white', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{ width: 40, height: 40, background: form.program_id === p.id ? '#FF6B35' : '#f8fafc', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: form.program_id === p.id ? 'white' : '#FF6B35' }}><CheckCircle size={20} /></div>
                    <div>
                      <div style={{ fontWeight: 800, color: '#111' }}>{p.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{p.group} • {p.amount}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-2" style={{ gap: 32 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <h2 className="hindi" style={{ fontSize: '1.75rem', fontWeight: 900, color: '#111', marginBottom: 8 }}>{t('Academic & Family Background')}</h2>
              <p className="hindi" style={{ color: '#64748b', fontSize: '0.9rem' }}>{t('This information helps our AI system calculate your priority score.')}</p>
            </div>
            
            <div>
              <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: 12, textTransform: 'uppercase' }}>{t('Full Name')}</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input required value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none' }} placeholder="Sumit Kumar" />
              </div>
            </div>

            <div>
               <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: 12, textTransform: 'uppercase' }}>{t('Category')}</label>
               <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none', background: 'white' }}>
                  {['General', 'OBC', 'SC', 'ST'].map(c => <option key={c} value={c.toLowerCase()}>{t(c)}</option>)}
               </select>
            </div>

            <div>
               <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: 12, textTransform: 'uppercase' }}>{t('Father\'s Profession')}</label>
               <select style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none', background: 'white' }}>
                  {['Farmer', 'Laborer', 'Small Business', 'Private Job', 'Government', 'Unemployed'].map(p => <option key={p} value={p}>{t(p)}</option>)}
               </select>
            </div>

            <div>
              <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: 12, textTransform: 'uppercase' }}>{t('Annual Family Income')}</label>
              <div style={{ position: 'relative' }}>
                <Landmark size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input type="number" required value={form.annual_income} onChange={e => setForm({...form, annual_income: e.target.value})} style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none' }} placeholder="e.g. 50000" />
              </div>
            </div>

            <div>
              <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: 12, textTransform: 'uppercase' }}>{t('Previous Year Marks (%)')}</label>
              <input type="number" required value={form.previous_marks} onChange={e => setForm({...form, previous_marks: e.target.value})} style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid #e2e8f0', outline: 'none' }} placeholder="e.g. 85" />
            </div>

            <div>
              <label className="hindi" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: 12, textTransform: 'uppercase' }}>{t('Previous Scholarship Winner?')}</label>
              <div style={{ display: 'flex', gap: 12 }}>
                 <button type="button" className="hindi" style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1px solid #e2e8f0', background: 'white' }}>{t('Yes')}</button>
                 <button type="button" className="hindi" style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1px solid #FF6B35', background: '#fff7ed', color: '#FF6B35', fontWeight: 800 }}>{t('No')}</button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="hindi" style={{ fontSize: '1.75rem', fontWeight: 900, color: '#111', marginBottom: 12 }}>{t('Document Upload')}</h2>
            <p className="hindi" style={{ color: '#64748b', marginBottom: 32 }}>{t('Upload clear copies of the following documents (Max 5MB each).')}</p>
            
            <div className="grid grid-2" style={{ gap: 24 }}>
               {[
                 { key: 'photo', label: t('Student Photo'), icon: <Camera size={20} />, required: true },
                 { key: 'aadhaar', label: t('Aadhaar Card'), icon: <ShieldCheck size={20} />, required: true },
                 { key: 'income', label: t('Income Certificate'), icon: <Landmark size={20} />, required: true },
                 { key: 'marksheet', label: t('Previous Marksheet'), icon: <FileText size={20} />, required: true }
               ].map((doc, i) => (
                 <div key={i} style={{ position: 'relative' }}>
                   <label htmlFor={`file-${doc.key}`} style={{ display: 'block' }}>
                     <div style={{ 
                       border: docFiles[doc.key] ? '2px solid #10b981' : '2px dashed #e2e8f0', 
                       borderRadius: 20, padding: '40px 24px', textAlign: 'center', cursor: 'pointer', 
                       background: docFiles[doc.key] ? '#f0fdf4' : '#f8fafc', transition: 'all 0.2s' 
                     }}>
                        <div style={{ 
                          width: 56, height: 56, background: 'white', borderRadius: 12, 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', 
                          margin: '0 auto 16px', color: docFiles[doc.key] ? '#10b981' : '#FF6B35', 
                          boxShadow: '0 4px 10px rgba(0,0,0,0.05)' 
                        }}>{docFiles[doc.key] ? <CheckCircle size={24} /> : doc.icon}</div>
                        
                        <div className="hindi" style={{ fontWeight: 800, fontSize: '1rem', color: '#1e293b' }}>
                          {docFiles[doc.key] ? docFiles[doc.key].name : doc.label}
                        </div>
                        
                        <div className="hindi" style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 8 }}>
                          {docFiles[doc.key] ? t('Click to change file') : t('Click to upload PDF or Image')}
                        </div>
                        
                        {doc.required && !docFiles[doc.key] && (
                          <div style={{ position: 'absolute', top: 12, right: 12, background: '#fee2e2', color: '#ef4444', padding: '4px 8px', borderRadius: 6, fontSize: '0.65rem', fontWeight: 800 }}>
                            {t('Required')}
                          </div>
                        )}
                     </div>
                   </label>
                   <input 
                     type="file" 
                     id={`file-${doc.key}`} 
                     style={{ display: 'none' }} 
                     accept="application/pdf,image/*"
                     onChange={(e) => handleFileChange(doc.key, e.target.files[0])}
                   />
                 </div>
               ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
             <h2 className="hindi" style={{ fontSize: '1.75rem', fontWeight: 900, color: '#111', marginBottom: 12 }}>{t('Review Your Application')}</h2>
             <p className="hindi" style={{ color: '#64748b', marginBottom: 32 }}>{t('Please verify all information before final submission.')}</p>
             
             <div style={{ background: '#f8fafc', borderRadius: 24, padding: '24px', border: '1px solid #e2e8f0' }}>
                <div className="grid grid-2" style={{ gap: 32 }}>
                   <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: 20 }}>
                      <div>
                        <div className="hindi" style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>{t('Selected Program')}</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FF6B35', marginTop: 4 }}>DVS High School Merit</div>
                      </div>
                      <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#475569', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}>{t('Change')}</button>
                   </div>
                   
                   <div>
                      <div className="hindi" style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 800 }}>{t('Full Name')}</div>
                      <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1.1rem' }}>{form.full_name || 'Sumit Kumar'}</div>
                   </div>
                   <div>
                      <div className="hindi" style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 800 }}>{t('Annual Income')}</div>
                      <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1.1rem' }}>₹{form.annual_income || '50,000'}</div>
                   </div>
                   <div>
                      <div className="hindi" style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 800 }}>{t('Previous Marks')}</div>
                      <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1.1rem' }}>{form.previous_marks || '85'}%</div>
                   </div>
                   <div>
                      <div className="hindi" style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 800 }}>{t('Category')}</div>
                      <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '1.1rem', textTransform: 'uppercase' }}>{form.category}</div>
                   </div>
                </div>

                <div style={{ marginTop: 40, paddingTop: 32, borderTop: '2px solid #e2e8f0' }}>
                   <label style={{ display: 'flex', gap: 16, cursor: 'pointer', alignItems: 'flex-start' }}>
                      <input type="checkbox" checked={form.declaration} onChange={e => setForm({...form, declaration: e.target.checked})} style={{ width: 24, height: 24, accentColor: '#FF6B35', marginTop: 4 }} />
                      <span className="hindi" style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.6, fontWeight: 600 }}>{t('I certify that all the information provided above is correct to the best of my knowledge. I understand that any false information will lead to immediate disqualification.')}</span>
                   </label>
                </div>
             </div>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 48, borderTop: '1px solid #f1f5f9', paddingTop: 32 }}>
           <button onClick={prevStep} disabled={step === 1 || loading} style={{ padding: '12px 24px', borderRadius: 12, border: '1px solid #e2e8f0', background: 'white', color: step === 1 ? '#cbd5e1' : '#4b5563', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
             <ChevronLeft size={18} /> {t('Previous')}
           </button>
           
           <div style={{ display: 'flex', gap: 16 }}>
             {step < 4 ? (
               <button onClick={nextStep} style={{ padding: '12px 32px', borderRadius: 12, border: 'none', background: '#111', color: 'white', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                 {t('Next')} <ChevronRight size={18} />
               </button>
             ) : (
               <button onClick={handleSubmit} disabled={!form.declaration || loading} style={{ padding: '12px 40px', borderRadius: 12, border: 'none', background: '#1d4ed8', color: 'white', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, opacity: (!form.declaration || loading) ? 0.6 : 1, boxShadow: '0 4px 12px rgba(29, 78, 216, 0.2)' }}>
                 {loading ? t('Processing...') : <><Send size={20} /> {t('Submit Application')}</>}
               </button>
             )}
           </div>
        </div>

      </div>

    </div>
  )
}
