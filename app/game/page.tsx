'use client'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import BackToTop from '../../components/BackToTop'
import WaterManagerGame from '../../components/WaterManagerGame'

export default function GamePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <div className="text-center">
            <div className="inline-block mb-4">
              <span className="text-6xl animate-bounce inline-block">🎮</span>
            </div>
            <h1 className="text-4xl font-extrabold md:text-5xl">
              Water Manager Challenge
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-indigo-200">
              Test your skills as a water manager! Balance Oklahoma City&apos;s water needs 
              with local recreation while following the Settlement Agreement rules.
            </p>
          </div>
        </div>
      </section>

      {/* Game Section */}
      <main className="mx-auto max-w-4xl px-4 py-12">
        <WaterManagerGame />

        {/* Game Info */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">🎯 Game Objective</h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Manage Sardis Lake for one week (7 days) in August. You must balance:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Oklahoma City&apos;s water demand:</strong> They need 300-500 cfs daily</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span><strong>Local recreation needs:</strong> Keep lake levels high for fishing and tourism</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">•</span>
                <span><strong>Settlement Agreement rules:</strong> Never release water when lake is below minimum</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">⚡ Special Events</h2>
            <p className="text-sm text-slate-700 leading-relaxed mb-3">
              Watch out for these events during your week:
            </p>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-2xl">🎣</span>
                <span><strong>Bass Tournament (Day 5):</strong> Brings $200K to local economy if lake is high enough</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-2xl">☀️</span>
                <span><strong>Weather changes:</strong> Sunny, rainy, drought, or storms affect water levels</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-2xl">📞</span>
                <span><strong>Stakeholder calls:</strong> Hear from OKC officials and local community</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-6">
            <h2 className="text-lg font-bold text-amber-900 mb-3">🏆 Achievements</h2>
            <p className="text-sm text-amber-800 leading-relaxed">
              Unlock achievements by completing special challenges:
            </p>
            <ul className="mt-3 space-y-1 text-sm text-amber-800">
              <li>🏆 First Victory - Win your first game</li>
              <li>⚖️ Perfect Balance - Keep both scores above 80%</li>
              <li>🔥 Streak Master - Achieve a 5-day streak</li>
              <li>🎯 High Scorer - Score over 1000 points</li>
              <li>💎 Expert Manager - Win on hard difficulty</li>
              <li>🌿 Eco Warrior - Keep lake above 598 ft all week</li>
              <li>⭐ Veteran - Play 10 games</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
            <h2 className="text-lg font-bold text-indigo-900 mb-3">💡 Pro Tips</h2>
            <ul className="space-y-2 text-sm text-indigo-800">
              <li className="flex items-start gap-2">
                <span className="font-bold">1.</span>
                <span>Watch the weather forecast - rain means less need to release water</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">2.</span>
                <span>Keep lake levels slightly above minimum for safety margin</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">3.</span>
                <span>Balance is key - don&apos;t ignore either stakeholder for too long</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">4.</span>
                <span>Save water before the Bass Tournament to ensure success</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">5.</span>
                <span>Start with Easy mode to learn, then challenge yourself with Hard!</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Educational Context */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">📚 Real-World Context</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            This game simulates real challenges faced by water managers in the Choctaw-Chickasaw 
            Water Settlement area. The 2016 Settlement Agreement established clear rules to balance 
            multiple competing interests:
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-blue-50 p-4 border border-blue-200">
              <div className="text-3xl mb-2">🏙️</div>
              <h3 className="font-bold text-blue-900 mb-2">Municipal Water</h3>
              <p className="text-sm text-blue-800">
                Oklahoma City has storage rights in Sardis Lake for municipal water supply
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200">
              <div className="text-3xl mb-2">🎣</div>
              <h3 className="font-bold text-emerald-900 mb-2">Recreation & Tourism</h3>
              <p className="text-sm text-emerald-800">
                Local communities depend on lake levels for fishing, boating, and tourism revenue
              </p>
            </div>
            <div className="rounded-xl bg-purple-50 p-4 border border-purple-200">
              <div className="text-3xl mb-2">⚖️</div>
              <h3 className="font-bold text-purple-900 mb-2">Tribal Rights</h3>
              <p className="text-sm text-purple-800">
                The Choctaw and Chickasaw Nations have water rights that must be respected
              </p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <a
              href="/settlement"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-white font-semibold hover:bg-indigo-700 transition-colors"
            >
              Learn More About the Settlement Agreement
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </main>

      <BackToTop />
      <Footer />
    </div>
  )
}
