// components/LottieInterview.jsx
import { Player } from '@lottiefiles/react-lottie-player'

export default function LottieInterview() {
  return (
    <Player
      autoplay
      loop
      src="https://assets4.lottiefiles.com/packages/lf20_tno6cg2w.json" // Replace with preferred animation
      style={{ height: '450px', width: '100%' }}
    />
  )
}
