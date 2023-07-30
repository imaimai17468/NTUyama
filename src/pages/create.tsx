import Wave from "react-wavify";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { BsFillMicFill, BsFillMicMuteFill } from "react-icons/bs";
import { useState } from "react";

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <main className="w-screen h-screen flex items-center justify-center font-sawarabi flex-col gap-8">
      <ul className="steps">
        <li className="step step-primary">よもやまを記録</li>
        <li className="step">markdownに変換</li>
        <li className="step">ドキュメントに貼り付ける</li>
      </ul>
      <div className="w-3/4 h-2/3 border border-white rounded-xl flex flex-col">
        <div className="border-b border-white p-3 flex gap-3">
          <div className="w-3 h-3 rounded-full bg-white bg-opacity-50" />
          <div className="w-3 h-3 rounded-full bg-white bg-opacity-50" />
          <div className="w-3 h-3 rounded-full bg-white bg-opacity-50" />
        </div>
        <div className="p-3 flex justify-center gap-3 h-full">
          <div className="mockup-code w-1/2">
            <div className="px-8">
              <label className="swap">
                <input
                  type="checkbox"
                  checked={isRecording}
                  defaultChecked={isRecording}
                  onChange={() => setIsRecording(!isRecording)}
                />
                <div className="swap-on">
                  <div className="border border-primary rounded-full flex w-8 h-8 items-center justify-center text-primary">
                    <BsFillMicFill />
                  </div>
                </div>
                <div className="swap-off">
                  <div className="border border-warning rounded-full flex w-8 h-8 items-center justify-center text-warning">
                    <BsFillMicMuteFill />
                  </div>
                </div>
              </label>
            </div>
          </div>
          <div className="w-1/2 preview border border-base-200 rounded-xl p-3 overflow-y-scroll">
            <div className="border border-white rounded-lg flex p-2 gap-2">
              <p className="flex-1">aaa</p>
              <button className="btn btn-primary btn-outline btn-circle btn-xs">
                <AiFillEdit />
              </button>
              <button className="btn btn-warning btn-outline btn-circle btn-xs">
                <AiFillDelete />
              </button>
            </div>
          </div>
        </div>
      </div>
      <button className="btn btn-primary normal-case">Markdownに変換</button>
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
