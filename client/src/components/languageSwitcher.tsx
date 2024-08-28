import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const changeLanguage = (lng: any) => {
    i18n.changeLanguage(lng)
  }

  return (
    <select
      onChange={(e) => changeLanguage(e.target.value)}
      value={i18n.language}
      className='dark:highlight-white/5 text-xsleading-5 col-start-1 row-start-1 mb-4 flex appearance-none items-center space-x-2 rounded-lg border bg-slate-400/10 bg-slate-50 p-2 px-3 py-1 text-[14px] font-semibold hover:bg-slate-400/20'
    >
      <option value='en'>English</option>
      <option value='uz'>Uzbek</option>
      <option value='ru'>Russian</option>
    </select>
  )
}
