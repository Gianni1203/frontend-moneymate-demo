/**
 * 登入保護（PRD §7）：
 * - 沒登入 → /login
 * - 已登入但沒完成問卷 → /onboarding
 * - 已完成問卷就不能再進 /onboarding
 */
const PUBLIC = ['/login', '/register']

export default defineNuxtRouteMiddleware(async (to) => {
  const { token, me, fetchMe } = useAuth()
  const isPublic = PUBLIC.includes(to.path)

  if (!token.value) return isPublic ? undefined : navigateTo('/login')

  if (!me.value) {
    try {
      await fetchMe()
    } catch {
      return isPublic ? undefined : navigateTo('/login')
    }
  }
  if (isPublic) return navigateTo('/')
  if (!me.value!.hasCompletedOnboarding && to.path !== '/onboarding') return navigateTo('/onboarding')
  if (me.value!.hasCompletedOnboarding && to.path === '/onboarding') return navigateTo('/')
})
