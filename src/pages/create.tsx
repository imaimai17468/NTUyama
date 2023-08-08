import Wave from "react-wavify";
import { AiFillEdit, AiFillDelete, AiOutlineCopy } from "react-icons/ai";
import { BsFillMicFill, BsFillMicMuteFill } from "react-icons/bs";
import { useState, useEffect } from "react";
import { AudioVisualizer } from "@/components/common";
import { OpenAIApi, Configuration } from "openai";
import { useRouter } from "next/router";

type EditableText = {
  index: number;
  isEditing: boolean;
};

const PROMPT = `Please provide a bulleted summary of the following conversation in Japanese, separating and summarizing the topics discussed and listing the main points of each topic.
Example format :
- title
  - point 1
  - point2
`;

export default function Home() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [text, setText] = useState<string>("");
  const [allText, setAllText] = useState<string[]>([]);
  const [transcript, setTranscript] = useState<string>("");
  const [editableText, setEditableText] = useState<EditableText[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");
  const [step, setStep] = useState<number>(0);

  const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const handleSubmit = async () => {
    setIsLoading(true);
    setStep(1);
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: PROMPT + "\n" + allText.join("\n") }],
    });

    setResult(
      response.data.choices[0].message?.content || "データの取得に失敗しました"
    );
    setIsLoading(false);
  };

  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );
  useEffect(() => {
    if (typeof window !== "undefined") {
      const recognition = new webkitSpeechRecognition();
      recognition.lang = "ja-JP";
      recognition.continuous = true;
      recognition.interimResults = true;
      setRecognition(recognition);
    }
  }, []);

  useEffect(() => {
    if (!recognition) return;

    if (isRecording) {
      recognition.start();
    } else {
      recognition.stop();
      if (text) setAllText([...allText, text]);
      setText("");
    }
  }, [isRecording]);

  useEffect(() => {
    if (!recognition) return;
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
  }, [recognition]);

  return (
    <main className="w-screen h-screen flex items-center justify-center font-sawarabi flex-col gap-8">
      <input type="checkbox" id="result" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box max-w-5xl flex flex-col gap-4">
          <h2 className="font-bold text-2xl">変換結果</h2>
          <div className="preview border border-base-200 rounded-lg p-2 flex flex-col gap-2">
            <div
              className="ml-auto text-white tooltip tooltip-warning tooltip-left"
              data-tip="コピーしてドキュメントに貼り付けよう"
            >
              <button
                className="btn btn-circle btn-warning btn-sm"
                onClick={() => {
                  navigator.clipboard.writeText(result);
                  setStep(2);
                }}
              >
                <AiOutlineCopy />
              </button>
            </div>
            <div className="mockup-code">
              <div className="px-8">
                {isLoading && (
                  <span className="loading loading-dots loading-lg"></span>
                )}
                {result.split("\n").map((line, i) => (
                  <div key={i} className="flex gap-2">
                    {line.split(" ").map((word, j) => (
                      <span key={j} className="inline-block">
                        {word}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              router.push("/");
            }}
          >
            トップページに戻る
          </button>
        </div>
      </div>
      <ul className="steps">
        <li className={`step ${step >= 0 && "step-primary"}`}>
          よもやまを記録
        </li>
        <li className={`step ${step >= 1 && "step-primary"}`}>
          markdownに変換
        </li>
        <li className={`step ${step >= 2 && "step-primary"}`}>
          ドキュメントに貼り付ける
        </li>
      </ul>
      <div className="w-3/4 h-2/3 border border-white rounded-xl flex flex-col z-10 bg-base-100">
        <div className="border-b border-white p-3 flex gap-3">
          <div className="w-3 h-3 rounded-full bg-white bg-opacity-50" />
          <div className="w-3 h-3 rounded-full bg-white bg-opacity-50" />
          <div className="w-3 h-3 rounded-full bg-white bg-opacity-50" />
        </div>
        <div className="p-3 flex md:flex-row flex-col md:justify-center gap-3 h-[92.5%]">
          <div className="mockup-code w-full md:w-1/2 md:h-full h-1/2">
            <div className="px-8 flex flex-col gap-4 items-start h-[90%]">
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
              <div className="overflow-y-scroll w-full">
                <div className="mb-2 ml-4">
                  <p className="text-gray-300">解析 : {transcript}</p>
                </div>
                {text &&
                  `${text}`
                    .split(" ")
                    .map((word, index) => (
                      <div className="flex gap-4 break-all" key={index}>
                        <span className="text-neutral-focus mr-4">$</span>
                        <p>{word}</p>
                      </div>
                    ))
                    .reverse()}
              </div>
            </div>
          </div>
          <div className="w-full h-1/2 md:h-full md:w-1/2 preview border border-base-200 rounded-xl p-3 overflow-y-scroll gap-4 flex flex-col">
            {allText
              .map((text, index) => (
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
              ))
              .reverse()}
          </div>
        </div>
      </div>
      {allText.length > 0 ? (
        <div
          className="tooltip tooltip-primary tooltip-right"
          data-tip="トークン削減のため、一度変換するとこのページに戻ってこれません"
        >
          <label
            className="btn btn-primary normal-case"
            htmlFor="result"
            onClick={handleSubmit}
          >
            Markdownに変換
          </label>
        </div>
      ) : (
        <button className="btn btn-primary normal-case" disabled>
          Markdownに変換
        </button>
      )}
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
