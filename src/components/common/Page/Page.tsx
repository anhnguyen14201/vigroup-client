'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import toast from 'react-hot-toast'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Image from 'next/image'
import { apiCreatePage, apiGetPageBySlug, apiUpdatePage } from '@/api'
import { UseLanguageResult } from '@/interface'
import { Trash2 } from 'lucide-react'
import { Input } from '@/components/ui'
import nProgress from 'nprogress'
import { useLanguage } from '@/hooks'

// --- Types ---
interface MultilangString {
  [lang: string]: string
}
interface Article {
  image: string
  position: 'left' | 'right'
  sectionLabel: MultilangString
  heading: MultilangString
  subtext: MultilangString
  features: { [lang: string]: string[] }
  videoUrl?: string
  titleButton?: MultilangString
  buttonUrl?: string
  file?: File
}
interface HeroSection {
  image: string // URL hoặc preview
  imageFile?: File // File để upload
  heroSectionLabel: MultilangString
  heroHeading: MultilangString
}

interface HeroSectionData {
  page: string
  seoTitle: MultilangString
  seoDescription: MultilangString
  heroSections: HeroSection[]
  articles: Article[]
}

export default function Page({
  initialPage = '',
  titleButtonPage = '',
  showAticles = true,
}: {
  initialPage?: string
  titleButtonPage?: string
  showAticles?: boolean
}) {
  const { items: languages } = useLanguage() as UseLanguageResult

  const langMeta = useMemo(() => {
    return languages.map(l => ({
      code: l.code,
      _id: l._id,
      iconUrl: l.iconUrl[0],
      name: l.name,
    }))
  }, [languages])

  const langs = useMemo(() => langMeta.map(l => l.code), [langMeta])

  // State
  const [currentLang, setCurrentLang] = useState<string>(() => langs[0] || '')
  const [open, setOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [data, setData] = useState<any>(null)

  const heroRef = useRef<HTMLInputElement>(null)
  const articleRefs = useRef<(HTMLInputElement | null)[]>([])

  // Helper khởi tạo object đa ngôn ngữ
  function emptyMulti<T>(defaultValue: T) {
    return langs.reduce(
      (o, c) => ({ ...o, [c]: defaultValue }),
      {} as Record<string, T>,
    )
  }

  // Form data
  const [formData, setFormData] = useState<HeroSectionData>({
    page: initialPage,
    seoTitle: emptyMulti(''),
    seoDescription: emptyMulti(''),
    heroSections: [
      {
        image: '',
        heroSectionLabel: emptyMulti(''),
        heroHeading: emptyMulti(''),
      },
    ],
    articles: [
      {
        image: '',
        position: 'left',
        sectionLabel: emptyMulti(''),
        heading: emptyMulti(''),
        subtext: emptyMulti(''),
        features: emptyMulti<string[]>(['']),
        videoUrl: '',
        titleButton: emptyMulti(''),
        buttonUrl: '',
      },
    ],
  })

  // Fetch nếu edit
  useEffect(() => {
    if (!initialPage || langMeta.length === 0) return
    apiGetPageBySlug(initialPage)
      .then(res => {
        const d = res?.data?.data
        if (!d) return
        setData(d)

        // SEO
        const seoTitle: MultilangString = {}
        const seoDescription: MultilangString = {}
        d.translations?.forEach((t: any) => {
          const lm = langMeta.find(l => l._id === t.language)
          if (!lm) return
          seoTitle[lm.code] = t.seoTitle
          seoDescription[lm.code] = t.seoDescription
        })

        // Articles
        const arts: Article[] = d.articles.map((a: any) => {
          const art: Article = {
            image: a.imageUrls[0] || '',
            position: a.position[0] as 'left' | 'right',
            sectionLabel: emptyMulti(''),
            heading: emptyMulti(''),
            subtext: emptyMulti(''),
            features: emptyMulti<string[]>([]),
            videoUrl: a.videoUrl || '',
            titleButton: emptyMulti(''),
            buttonUrl: a.buttonUrl || '',
          }
          a.translations.forEach((tr: any) => {
            const lm = langMeta.find(l => l._id === tr.language)
            if (!lm) return
            art.sectionLabel[lm.code] = tr.sectionLabel
            art.heading[lm.code] = tr.heading
            art.subtext[lm.code] = tr.subtext
            art.features[lm.code] = tr.features
          })
          return art
        })

        // HeroSections
        const hsArr: HeroSection[] = (d.heroSections || []).map((h: any) => {
          const obj: HeroSection = {
            image: h.imageUrls[0] || '',
            heroSectionLabel: emptyMulti(''),
            heroHeading: emptyMulti(''),
          }
          h.translations.forEach((tr: any) => {
            const lm = langMeta.find(l => l._id === tr.language)
            if (!lm) return
            obj.heroSectionLabel[lm.code] = tr.heroSectionLabel
            obj.heroHeading[lm.code] = tr.heroHeading
          })
          return obj
        })

        setFormData({
          page: d.page,
          seoTitle,
          seoDescription,
          heroSections: hsArr,
          articles: arts,
        })
      })

      .catch()
  }, [initialPage, langMeta])

  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!initialized && langs.length > 0) {
      setCurrentLang(langs[0])
      setInitialized(true)
    }
  }, [langs, initialized])

  // Cập nhật state helper
  const setField = (f: keyof HeroSectionData, v: any) =>
    setFormData(p => ({ ...p, [f]: v }))

  const setMultiField = (
    f: 'seoTitle' | 'seoDescription',
    c: string,
    v: string,
  ) => setField(f, { ...formData[f], [c]: v })

  const updateArticleText = (
    idx: number,
    field: 'sectionLabel' | 'heading' | 'subtext',
    lang: string,
    val: string,
  ) => {
    const arts = [...formData.articles]
    arts[idx][field][lang] = val
    setField('articles', arts)
  }
  const updateHeroText = (
    idx: number,
    field: 'heroSectionLabel' | 'heroHeading',
    lang: string,
    val: string,
  ) => {
    const arr = [...formData.heroSections]
    arr[idx][field][lang] = val
    setField('heroSections', arr)
  }
  const updateHeroField = (
    idx: number,
    field: 'image' | 'imageFile',
    val: any,
  ) => {
    const arr = [...formData.heroSections]
    ;(arr[idx] as any)[field] = val
    setField('heroSections', arr)
  }
  const updateArticleField = (
    idx: number,
    field:
      | 'image'
      | 'position'
      | 'videoUrl'
      | 'features'
      | 'file'
      | 'titleButton'
      | 'buttonUrl',
    val: any,
  ) => {
    const arts = [...formData.articles]
    if (field === 'features') arts[idx].features = val
    else (arts[idx] as any)[field] = val
    setField('articles', arts)
  }

  const addArticle = () =>
    setField('articles', [
      ...formData.articles,
      {
        image: '',
        position: 'left',
        sectionLabel: emptyMulti(''),
        heading: emptyMulti(''),
        subtext: emptyMulti(''),
        features: emptyMulti<string[]>(['']),
        videoUrl: '',
        titleButton: emptyMulti(''),
        buttonUrl: '',
      },
    ])
  const removeArticle = (idx: number) =>
    setField(
      'articles',
      formData.articles.filter((_, i) => i !== idx),
    )

  // Save
  const handleSave = async () => {
    if (!formData.page) {
      toast.error('Vui lòng nhập page identifier')
      return
    }
    setIsSaving(true)
    nProgress.start()
    try {
      const fd = new FormData()
      fd.append('page', formData.page)

      // SEO payload
      const seoTr = langs.map(code => {
        const lm = langMeta.find(l => l.code === code)!
        return {
          language: lm._id,
          seoTitle: formData.seoTitle[code],
          seoDescription: formData.seoDescription[code],
        }
      })
      fd.append('translations', JSON.stringify(seoTr))

      // Articles payload
      const artsPayload = formData.articles.map(art => {
        const urls = art.file
          ? []
          : art.image
          ? [art.image] // art.image ở đây là URL gốc từ server
          : []
        return {
          position: art.position,
          translations: langs.map(code => {
            const lm = langMeta.find(l => l.code === code)!
            return {
              language: lm._id,
              sectionLabel: art.sectionLabel[code],
              heading: art.heading[code],
              subtext: art.subtext[code],
              features: art.features[code],
              titleButton: art.titleButton?.[code] ?? '',
            }
          }),
          imageUrls: urls,
          videoUrl: art.videoUrl || '',
          buttonUrl: art.buttonUrl || '',
        }
      })

      // HeroSections payload
      const heroSectionPayload = formData.heroSections.map(h => {
        const urls = h.imageFile ? [] : h.image ? [h.image] : []
        return {
          translations: langs.map(code => {
            const lm = langMeta.find(l => l.code === code)!
            return {
              language: lm._id,
              heroSectionLabel: h.heroSectionLabel[code],
              heroHeading: h.heroHeading[code],
            }
          }),
          imageUrls: urls,
        }
      })

      fd.append('articles', JSON.stringify(artsPayload))
      fd.append('heroSections', JSON.stringify(heroSectionPayload))

      // Append files
      formData.articles.forEach((art, idx) => {
        if (art.file) fd.append(`articleImages[${idx}]`, art.file)
      })
      formData.heroSections.forEach((h, i) => {
        if (h.imageFile) fd.append(`heroImages[${i}]`, h.imageFile)
      })

      let res
      if (data?._id) {
        res = await apiUpdatePage(fd, data._id)
      } else {
        res = await apiCreatePage(fd)
      }
      if (res.data.success) {
        toast.success('Lưu thành công')
        await apiGetPageBySlug(initialPage)
        setOpen(false)
      } else throw new Error(res.data.message)
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi lưu')
    } finally {
      setIsSaving(false)
      nProgress.done()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className='bg-blue-100 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-200 cursor-pointer
                    border-1 border-blue-500 font-semibold'
        >
          {data ? `✎ Sửa ${titleButtonPage}` : `+ Thêm ${titleButtonPage}`}
        </button>
      </DialogTrigger>
      <DialogContent className='min-w-[90vw] max-h-[90vh] overflow-auto'>
        {/* Language switch */}
        <div className='flex justify-center space-x-3 mb-4'>
          {langMeta.map(l => (
            <button
              key={l.code}
              onClick={() => setCurrentLang(l.code)}
              className={`p-0.5 rounded-full border cursor-pointer ${
                currentLang === l.code
                  ? 'border-red-600'
                  : 'border-transparent opacity-50 hover:border-red-600'
              }`}
            >
              <Image
                priority
                src={l.iconUrl}
                alt={l.name}
                width={24}
                height={24}
                className='rounded-full'
              />
            </button>
          ))}
        </div>

        <div className='grid lg:grid-cols-2 gap-6 p-4'>
          {/* Form side */}
          <div className='space-y-6'>
            {/* SEO */}
            <div className='border p-4 rounded space-y-4'>
              <h3 className='font-semibold'>SEO</h3>

              <div>
                <label>Tiêu đề cho SEO ({currentLang.toUpperCase()})</label>
                <input
                  className='w-full border rounded p-2'
                  value={formData.seoTitle[currentLang]}
                  onChange={e =>
                    setMultiField('seoTitle', currentLang, e.target.value)
                  }
                />
              </div>
              <div>
                <label> Mô tả cho SEO ({currentLang.toUpperCase()})</label>
                <textarea
                  className='w-full border rounded p-2'
                  rows={2}
                  value={formData.seoDescription[currentLang]}
                  onChange={e =>
                    setMultiField('seoDescription', currentLang, e.target.value)
                  }
                />
              </div>
            </div>

            {/* Hero Sections */}
            {formData.heroSections.map((h, i) => (
              <div key={i} className='border p-4 rounded space-y-4'>
                <h3 className='font-semibold'>Banner</h3>
                <div className='w-full flex flex-1'>
                  <Input
                    id={`hero-image-input-${i}`}
                    ref={heroRef}
                    type='file'
                    accept='image/*'
                    onChange={e => {
                      const f = e.target.files?.[0]
                      if (!f) return
                      updateHeroField(i, 'imageFile', f)
                      updateHeroField(i, 'image', URL.createObjectURL(f))
                    }}
                    className='hidden'
                  />
                  <label
                    htmlFor={`hero-image-input-${i}`}
                    className='cursor-pointer w-full border-2 border-dashed rounded-md p-4 
                          text-center hover:border-red-400 transition duration-300'
                  >
                    Chọn ảnh
                  </label>
                </div>
                {/*                 {h.image && (
                  <img
                    src={h.image}
                    alt={`preview-${i}`}
                    className='w-fit h-28 object-contain rounded bg-gray-100'
                  />
                )} */}
                <div>
                  <label>Tiêu đề ({currentLang.toUpperCase()})</label>
                  <input
                    className='w-full border rounded p-2'
                    value={h.heroSectionLabel[currentLang]}
                    onChange={e =>
                      updateHeroText(
                        i,
                        'heroSectionLabel',
                        currentLang,
                        e.target.value,
                      )
                    }
                  />
                </div>
                <div>
                  <label>Mô tả ({currentLang.toUpperCase()})</label>
                  <textarea
                    className='w-full border rounded p-2'
                    rows={2}
                    value={h.heroHeading[currentLang]}
                    onChange={e =>
                      updateHeroText(
                        i,
                        'heroHeading',
                        currentLang,
                        e.target.value,
                      )
                    }
                  />
                </div>
              </div>
            ))}

            {/* Articles */}
            {showAticles && (
              <>
                {formData.articles.map((art, idx) => (
                  <div key={idx} className='border p-4 rounded space-y-4'>
                    <div className='flex justify-between items-center'>
                      <h3 className='font-semibold'>Bài viết #{idx + 1}</h3>
                      <button
                        onClick={() => removeArticle(idx)}
                        className='text-red-500 p-1 rounded-full hover:bg-red-200 cursor-pointer transition-all duration-300'
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                    <div className='flex flex-1'>
                      <Input
                        id={`article-image-input-${idx}`}
                        ref={el => {
                          articleRefs.current[idx] = el
                        }}
                        type='file'
                        accept='image/*'
                        onChange={e => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          updateArticleField(
                            idx,
                            'image',
                            URL.createObjectURL(file),
                          )
                          updateArticleField(idx, 'file', file)
                        }}
                        className='hidden'
                      />

                      <label
                        htmlFor={`article-image-input-${idx}`}
                        className='cursor-pointer w-full border-2 border-dashed rounded-md p-4 
                            text-center hover:border-red-400 transition duration-300'
                      >
                        Chọn ảnh
                      </label>
                    </div>

                    <div>
                      <label>Vị trí ảnh</label>
                      <select
                        className='w-full border rounded p-2'
                        value={art.position}
                        onChange={e =>
                          updateArticleField(idx, 'position', e.target.value)
                        }
                      >
                        <option value='left'>Ảnh nằm ở bên trái</option>
                        <option value='right'>Ảnh nằm ở bên phải</option>
                      </select>
                    </div>
                    <div>
                      <label>Video URL</label>
                      <input
                        className='w-full border rounded p-2'
                        placeholder='https://youtu.be/...'
                        value={art.videoUrl}
                        onChange={e =>
                          updateArticleField(idx, 'videoUrl', e.target.value)
                        }
                      />
                    </div>

                    {(['sectionLabel', 'heading', 'subtext'] as const).map(
                      f => (
                        <div key={f}>
                          <label>
                            {f === 'sectionLabel'
                              ? 'Tiêu đề'
                              : f === 'heading'
                              ? 'Chỉ mục'
                              : 'Mô tả'}{' '}
                            ({currentLang.toUpperCase()})
                          </label>
                          {f === 'subtext' ? (
                            <textarea
                              className='w-full border rounded p-2'
                              rows={2}
                              value={art.subtext[currentLang]}
                              onChange={e =>
                                updateArticleText(
                                  idx,
                                  'subtext',
                                  currentLang,
                                  e.target.value,
                                )
                              }
                            />
                          ) : (
                            <input
                              className='w-full border rounded p-2'
                              value={(art as any)[f][currentLang]}
                              onChange={e =>
                                updateArticleText(
                                  idx,
                                  f,
                                  currentLang,
                                  e.target.value,
                                )
                              }
                            />
                          )}
                        </div>
                      ),
                    )}
                    <div>
                      <label>Thêm mô tả ({currentLang.toUpperCase()})</label>
                      {art.features[currentLang]?.map((feat, fi) => (
                        <div key={fi} className='flex gap-2 mt-1'>
                          <input
                            className='flex-1 border rounded p-2'
                            value={feat}
                            onChange={e => {
                              const updated = {
                                ...art.features,
                                [currentLang]: art.features[currentLang].map(
                                  (v, i2) => (i2 === fi ? e.target.value : v),
                                ),
                              }
                              updateArticleField(idx, 'features', updated)
                            }}
                          />
                          <button
                            onClick={() => {
                              const newFeatures = Object.fromEntries(
                                Object.entries(art.features).map(
                                  ([lang, arr]) => [
                                    lang,
                                    arr.filter((_, i2) => i2 !== fi),
                                  ],
                                ),
                              )
                              updateArticleField(idx, 'features', newFeatures)
                            }}
                          >
                            <div className='text-red-500 p-1 rounded-full hover:bg-red-200 cursor-pointer transition-all duration-300'>
                              <Trash2 className='w-4 h-4' />
                            </div>
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const newFeatures = Object.fromEntries(
                            Object.entries(art.features).map(([lang, arr]) => [
                              lang,
                              [...arr, ''],
                            ]),
                          )
                          updateArticleField(idx, 'features', newFeatures)
                        }}
                        className='mt-2 text-blue-600 cursor-pointer'
                      >
                        + Thêm mô tả
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addArticle}
                  className='w-full border rounded p-2 cursor-pointer'
                >
                  + Thêm bài viết
                </button>
              </>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className='w-full bg-blue-600 text-white p-2 rounded mt-4 disabled:opacity-50 cursor-pointer'
            >
              {isSaving ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>

          {/* Preview side */}
          <div className='space-y-6'>
            {formData.heroSections.map((h, i) => {
              const previewUrl = h.image
              const label = h.heroSectionLabel[currentLang]
              const heading = h.heroHeading[currentLang]

              return (
                <div
                  key={i}
                  className='relative w-full h-64 rounded overflow-hidden'
                >
                  {/* Ảnh full-cover */}
                  <Image
                    priority
                    src={previewUrl || ''}
                    alt={`Hero ${i + 1}`}
                    fill
                    className='object-cover'
                  />

                  {/* Lớp phủ mờ để chữ nổi bật */}
                  <div className='absolute inset-0 bg-black/60' />

                  {/* Overlay text căn giữa */}
                  <div className='absolute inset-0 flex flex-col justify-center items-center text-center px-4'>
                    {label && (
                      <p className='text-sm uppercase text-white mb-2'>
                        {label}
                      </p>
                    )}
                    {heading && (
                      <h2 className='text-3xl font-bold text-white'>
                        {heading}
                      </h2>
                    )}
                  </div>
                </div>
              )
            })}
            {formData.articles.map((art, idx) => (
              <div
                key={idx}
                className={`flex ${
                  art.position === 'right' ? 'lg:flex-row-reverse' : ''
                } bg-gray-50 rounded overflow-hidden`}
              >
                {art.image && (
                  <Image
                    priority
                    src={art.image}
                    alt=''
                    width={400}
                    height={300}
                    className='w-full lg:w-1/3 h-48 object-cover'
                  />
                )}
                <div className='p-4 flex-1'>
                  <div className='uppercase text-sm text-gray-500'>
                    {art.sectionLabel[currentLang]}
                  </div>
                  <h3 className='text-2xl font-bold'>
                    {art.heading[currentLang]}
                  </h3>
                  <p className='text-gray-600'>{art.subtext[currentLang]}</p>
                  <ul className='mt-2 space-y-1'>
                    {art.features[currentLang]?.map((f, i) => (
                      <li key={i} className='flex items-center'>
                        <span className='inline-block w-3 h-3 mr-2 rotate-45 border-b-2 border-r-2 border-green-600' />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
