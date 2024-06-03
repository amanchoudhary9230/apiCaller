import React, { useEffect, useState } from "react";
import { RiSendPlaneFill } from "react-icons/ri";
import { LocalStorage } from "./utils";
import axios, { AxiosError, AxiosResponse } from "axios";
import { ApiResponse } from "./interface";
import Apis from "./components/Apis";

const App: React.FC = () => {
  const [api, setApi] = useState<string>("");
  const [apis, setApis] = useState<string[]>(LocalStorage.get("apis") ?? []);
  const [apisResponse, setApisResponse] = useState<ApiResponse>({});
  const [time, setTime] = useState<number>(60);

  const fetchResponse = async (
    api: string
  ): Promise<AxiosResponse<any> | AxiosError<any>> => {
    try {
      const response = await axios(api);
      return response;
    } catch (error) {
      console.error("Error fetching data:", error);
      return error as AxiosError<any>;
    }
  };

  const callingApis = () => {
    apis.forEach((api: string) => {
      setApisResponse((prevLoadings) => ({
        ...prevLoadings,
        [api]: {
          loading: true,
          success: false,
          message: null,
        },
      }));
      fetchResponse(api).then((data: AxiosResponse<any> | AxiosError<any>) => {
        if ("data" in data) {
          // Check if data is AxiosResponse
          setApisResponse((prevLoadings) => ({
            ...prevLoadings,
            [api]: {
              loading: false,
              success: data.data.success,
              message: data.data.message,
            },
          }));
        } else {
          // Handle AxiosError
          console.error("Error fetching data:", data);
          setApisResponse((prevLoadings) => ({
            ...prevLoadings,
            [api]: {
              loading: false,
              success: false,
              message: data.message,
            },
          }));
        }
      });
    });
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApi("");
    if (apis.includes(api)) {
      return;
    }
    const updatedApis = LocalStorage.get("apis") ?? [];
    LocalStorage.set("apis", [...updatedApis, api]); // Store updated APIs in local storage
    setApis((prev) => [...prev, api]);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  useEffect(() => {
    callingApis();

    // Start the countdown timer
    setTime(60);
    const countdownInterval = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    // Cleanup intervals on component unmount
    return () => clearInterval(countdownInterval);
  }, [apis]);

  useEffect(() => {
    if (time <= 0) {
      setTime(60);
      callingApis();
    }
  }, [time]);

  return (
    <div className="h-full">
      <div className="h-[11rem] w-full px-2 py-1 bg-[rgb(191,126,96)]">
        <nav className="text-[#ced4da] md:px-4 flex justify-between italic font-jaro text-2xl">
          <div>Api Caller</div>
          <div className="text-[#ced4da]">{formatTime(time)}</div>
        </nav>
        <div className="flex justify-center h-full">
          <form
            onSubmit={submitHandler}
            className="w-[30rem] drop-shadow-2xl h-fit mt-7 flex gap-2"
          >
            <input
              type="url"
              value={api}
              onChange={(e) => setApi(e.target.value)}
              placeholder="http://example.com"
              className="outline-none bg-[#343a40] text-[#ced4da] placeholder:text-[#ced4da92] w-full px-4 py-1 rounded-s-xl"
            />
            <button type="submit" className="text-2xl text-[#343a40]">
              <RiSendPlaneFill />
            </button>
          </form>
        </div>
      </div>
      <div className="apis-window">
        <div className="h-full p-4">
          {Object.keys(apisResponse).length > 0 && (
            <Apis apis={apis} apisResponse={apisResponse} setApis={setApis} />
          )}
        </div>
      </div>
      <footer className="text-white text-sm px-2">
        Our website ensures the continuous availability and activity of the
        server by automatically re-calling GET APIs every 2 minutes.
      </footer>
    </div>
  );
};

export default App;
