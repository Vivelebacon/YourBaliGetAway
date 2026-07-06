import { MemberProvider } from '@/components/takeaways/MemberProvider'

// The Takeaways tree is community-aware: every page can read the member
// session (likes, comments, gated picks) through MemberProvider.
export default function TakeawaysLayout({ children }: { children: React.ReactNode }) {
  return <MemberProvider>{children}</MemberProvider>
}
