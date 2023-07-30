import Wave from "react-wavify";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { BsFillMicFill, BsFillMicMuteFill } from "react-icons/bs";
import { useState, useEffect } from "react";
import { AudioVisualizer } from "@/components/common";

type EditableText = {
  index: number;
  isEditing: boolean;
};

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [text, setText] = useState<string>("");
  const [allText, setAllText] = useState<string[]>([]);
  const [transcript, setTranscript] = useState<string>("");
  const [editableText, setEditableText] = useState<EditableText[]>([]);

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "ja-JP";
  recognition.continuous = true;
  recognition.interimResults = true;

  useEffect(() => {
    if (isRecording) {
      recognition.start();
    } else {
      recognition.stop();
      if (text) setAllText([...allText, text]);
      setText("");
    }
  }, [isRecording]);

  recognition.onresult = (event) => {
    const results = event.results;
    for (let i = event.resultIndex; i < results.length; i++) {
      if (results[i].isFinal) {
        setText((prevText) =>
          (
            (prevText ? prevText + " " : prevText) +
            results[i][0].transcript.replaceAll(" ", "、").replace("、", "")
          ).replaceAll("  ", " ")
        );
        setTranscript("");
      } else {
        setTranscript(results[i][0].transcript);
      }
    }
  };

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
            <div className="px-8 flex flex-col gap-4 items-start">
              <div className="flex items-center gap-4 w-full">
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
                <div className="h-8 w-full border border-white rounded-xl overflow-hidden">
                  {isRecording && <AudioVisualizer />}
                </div>
              </div>
              {text &&
                `${text}`.split(" ").map((word, index) => (
                  <div className="flex gap-4 break-all" key={index}>
                    <span className="text-neutral-focus mr-4">$</span>
                    <p>{word}</p>
                  </div>
                ))}
              <pre data-prefix="$">
                <code>{transcript}</code>
              </pre>
            </div>
          </div>
          <div className="w-1/2 preview border border-base-200 rounded-xl p-3 overflow-y-scroll gap-4 flex flex-col">
            {allText.map((text, index) => (
              <div
                key={index}
                className="border border-white rounded-lg flex p-2 gap-2"
              >
                {editableText.find((e) => e.index === index)?.isEditing ? (
                  <textarea
                    className="textarea textarea-bordered flex-1"
                    value={text.split(" ").join("\n")}
                    rows={text.split(" ").length}
                    onChange={(e) =>
                      setAllText(
                        allText.map((t, i) =>
                          i === index ? e.target.value : t
                        )
                      )
                    }
                  />
                ) : (
                  <div className="flex-1">
                    {text.split(" ").map((t) => (
                      <p key={t}>{t}</p>
                    ))}
                  </div>
                )}
                <button
                  className="btn btn-primary btn-outline btn-circle btn-xs"
                  // すでにあれば削除
                  onClick={() => {
                    if (editableText.find((e) => e.index === index)) {
                      setEditableText(
                        editableText.filter((e) => e.index !== index)
                      );
                    } else {
                      setEditableText([
                        ...editableText,
                        { index, isEditing: true },
                      ]);
                    }
                  }}
                >
                  <AiFillEdit />
                </button>
                <button
                  className="btn btn-warning btn-outline btn-circle btn-xs"
                  onClick={() =>
                    setAllText(allText.filter((_, i) => i !== index))
                  }
                >
                  <AiFillDelete />
                </button>
              </div>
            ))}
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
