import React, { useState, useRef, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons/faQrcode";
import useKeyboardShortcut from "use-keyboard-shortcut";
import PriceBox from "./PriceBox";
import SourcifyMenu from "./SourcifyMenu";
import { RuntimeContext } from "./useRuntime";

const CameraScanner = React.lazy(() => import("./search/CameraScanner"));

const Title: React.FC = () => {
  const { provider } = useContext(RuntimeContext);
  const [search, setSearch] = useState<string>();
  const [canSubmit, setCanSubmit] = useState<boolean>(false);
  const history = useHistory();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setCanSubmit(e.target.value.trim().length > 0);
    setSearch(e.target.value.trim());
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!canSubmit) {
      return;
    }

    history.push(`/search?q=${search}`);
  };

  const searchRef = useRef<HTMLInputElement>(null);
  useKeyboardShortcut(["/"], () => {
    searchRef.current?.focus();
  });

  const [isScanning, setScanning] = useState<boolean>(false);

  return (
    <>
      {isScanning && <CameraScanner turnOffScan={() => setScanning(false)} />}
      <div className="px-9 py-2 flex justify-between items-baseline">
        <Link className="self-center" to="/">
          <div className="text-2xl text-link-blue font-title font-bold flex items-center space-x-2">
            <img
              className="rounded-full"
              src="/otter.jpg"
              width={32}
              height={32}
              alt="An otter scanning"
              title="An otter scanning"
            />
            <span>Otterscan</span>
          </div>
        </Link>
        <div className="flex items-baseline space-x-3">
          {provider?.network.chainId === 1 && <PriceBox />}
          <form
            className="flex"
            onSubmit={handleSubmit}
            autoComplete="off"
            spellCheck={false}
          >
            <input
              className="w-full border-t border-b border-l rounded-l focus:outline-none px-2 py-1 text-sm"
              type="text"
              size={60}
              placeholder='Type "/" to search by address / txn hash / block number / ENS name'
              onChange={handleChange}
              ref={searchRef}
            />
            <button
              className="border bg-skin-button-fill hover:bg-skin-button-hover-fill focus:outline-none px-2 py-1 text-sm text-skin-button"
              type="button"
              onClick={() => setScanning(true)}
              title="Scan an ETH address using your camera"
            >
              <FontAwesomeIcon icon={faQrcode} />
            </button>
            <button
              className="rounded-r border-t border-b border-r bg-skin-button-fill hover:bg-skin-button-hover-fill focus:outline-none px-2 py-1 text-sm text-skin-button"
              type="submit"
            >
              Search
            </button>
          </form>
          <SourcifyMenu />
        </div>
      </div>
    </>
  );
};

export default React.memo(Title);
