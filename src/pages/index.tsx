import Wave from "react-wavify";
import { useRouter } from "next/router";
export default function Home() {
  const router = useRouter();

  return (
    <main className="w-screen h-screen flex items-center justify-center font-sawarabi">
      <div className="flex items-center gap-16">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="font-borel text-5xl">NTUyama</h1>
            <p>より気軽によもやまを</p>
          </div>
          <button
            className="btn btn-primary btn-outline"
            onClick={() => router.push("/create")}
          >
            よもやまを始める
          </button>
        </div>
        <div className="mockup-phone">
          <div className="camera"></div>
          <div className="display">
            <div className="artboard artboard-demo phone-1">
              <div className="flex flex-col gap-4 px-2">
                <div className="chat chat-start">
                  <div className="chat-bubble">What is NTUyama?</div>
                </div>
                <div className="chat chat-end">
                  <div className="chat-bubble">
                    It&apos;s an application to be used for
                    &quot;Yomoyama&quot;within NUTMEG!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Wave
        className="absolute bottom-0 -z-10"
        fill="#fff"
        paused={false}
        options={{
          height: 20,
          amplitude: 20,
          speed: 0.15,
          points: 3,
        }}
      />
    </main>
  );
}
