import React from "react";
import { ApisProps } from "../interface";
import { MdDelete } from "react-icons/md";
import { LocalStorage } from "../utils";

const Apis: React.FC<ApisProps> = ({ apis, apisResponse, setApis }) => {
  const deleteRequestHandler = (currentApi: string) => {
    const newApis = apis.filter((api) => api !== currentApi);
    setApis([...newApis]);
    LocalStorage.set("apis", newApis);
  };

  return (
    <div className="h-full overflow-y-auto flex flex-col gap-4">
      {apis.map(
        (api, count) =>
          apisResponse[api] && (
            <div key={count}>
              <div className="flex max-md:flex-col gap-y-4 bg-[#696a68bc] justify-between px-4 py-1 md:items-center">
                <a href={api} className="text-[#5bdde0] overflow-auto underline">
                  {api}
                </a>
                <div className="flex gap-6 md:w-4/12 justify-between items-center">
                  {apisResponse[api].loading ? (
                    <span className="loader my-1"></span>
                  ) : (
                    <div>
                      <div>
                        <span className="text-[#ced4da]">success:</span>{" "}
                        <span
                          className={`${
                            apisResponse[api].success
                              ? "text-green-600"
                              : "text-rose-500"
                          }`}
                        >
                          {apisResponse[api].success ? "true" : "false"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#ced4da]">message:</span>{" "}
                        <span className="text-[#f5ebe0]">
                          {apisResponse[api].message}
                        </span>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => deleteRequestHandler(api)}
                    className="text-2xl text-rose-500"
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            </div>
          )
      )}
    </div>
  );
};
export default Apis;