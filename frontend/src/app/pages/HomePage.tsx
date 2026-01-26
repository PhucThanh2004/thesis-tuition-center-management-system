import { EduHeader } from '../components/HomePage/EduHeader'
import { EduHero } from '../components/HomePage/EduHero'
import { EduAbout } from '../components/HomePage/EduAbout'
import { EduFeatures } from '../components/HomePage/EduFeatures'
import { EduCTA } from '../components/HomePage/EduCTA'
import { EduFooter } from '../components/HomePage/EduFooter'

interface HomeProps {
  onLoginClick: () => void
  onRegisterClick: () => void
}

export function Home({ onLoginClick, onRegisterClick }: HomeProps) {
  return (
    <div className="min-h-screen bg-[#f8faff]">
      <EduHeader
        onLoginClick={onLoginClick}
        onRegisterClick={onRegisterClick}
      />

      <EduHero />
      <EduAbout />
      <EduFeatures />
      <EduCTA />
      <EduFooter />
    </div>
  )
}
