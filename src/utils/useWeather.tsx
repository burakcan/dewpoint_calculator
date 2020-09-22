import { useEffect, useState } from "react";
import { BrowserView, ipcMain, ipcRenderer } from "electron";

export interface WeatherData {
  aktuelBasinc: number;
  denizSicaklik: number;
  denizVeriZamani: string;
  denizeIndirgenmisBasinc: number;
  gorus: string;
  hadiseKodu: string;
  istNo: number;
  kapalilik: number;
  karYukseklik: number;
  nem: number;
  rasatMetar: string;
  rasatSinoptik: string;
  rasatTaf: string;
  ruzgarHiz: number;
  ruzgarYon: number;
  sicaklik: number;
  veriZamani: string;
  yagis00Now: number;
  yagis1Saat: number;
  yagis6Saat: number;
  yagis10Dk: number;
  yagis12Saat: number;
  yagis24Saat: number;
}

if (process && process.type !== "renderer") {
  ipcMain.handle(
    "fetch-weather",
    (_, locationID) =>
      new Promise((resolve) => {
        const view = new BrowserView();

        view.webContents.on("did-finish-load", () => {
          view.webContents
            .executeJavaScript(
              `
          fetch("https://servis.mgm.gov.tr/web/sondurumlar?merkezid=${locationID}")
          .then(resp => resp.json())
        `
            )
            .then((result) => {
              resolve(result[0]);
              view.destroy();
            });
        });

        view.webContents.loadURL("https://www.mgm.gov.tr");
      })
  );
}

export function useWeather(
  locationID: string
): { temperature: number; humidity: number } | null {
  const [state, setState] = useState<WeatherData | null>(null);

  useEffect(() => {
    ipcRenderer
      .invoke("fetch-weather", locationID)
      .then((result: WeatherData) => setState(result));
  }, []);

  return state
    ? {
        temperature: state.sicaklik,
        humidity: state.nem,
      }
    : null;
}
