import { GoogleSpreadsheet } from "google-spreadsheet";
import SpreadsheetReader from "../../../src/core/reader";
import { MissingAuthError } from "../../../src/core/errors";

const GoogleSpreadsheetMock = GoogleSpreadsheet as jest.Mock;

jest.mock("google-spreadsheet");

describe("SpreadsheetReader", () => {
  describe("authenticate", () => {
    beforeEach(() => {
      GoogleSpreadsheetMock.mockClear();
    });

    afterEach(() => {
      delete process.env.LOKSE_API_KEY;
      delete process.env.LOKSE_SERVICE_ACCOUNT_EMAIL;
      delete process.env.LOKSE_PRIVATE_KEY;
    });

    it("uses service account if available", async () => {
      expect.assertions(2);
      const private_key = "this-is-dummy-private-key";
      const client_email = "this-is@dummy-email";
      process.env.LOKSE_SERVICE_ACCOUNT_EMAIL = client_email;
      process.env.LOKSE_PRIVATE_KEY = private_key;

      const reader = new SpreadsheetReader("test-sheet-id", "*");
      await reader.authenticate();

      const useServiceAccountAuthMock =
        GoogleSpreadsheetMock.mock.instances[0].useServiceAccountAuth;
      expect(useServiceAccountAuthMock).toHaveBeenCalledTimes(1);
      expect(useServiceAccountAuthMock).toHaveBeenLastCalledWith({
        client_email,
        private_key,
      });
    });

    it("uses api key if available", async () => {
      expect.assertions(2);
      const dummyApiKey = "dummy-api-key";
      process.env.LOKSE_API_KEY = dummyApiKey;

      const reader = new SpreadsheetReader("test-sheet-id", "*");
      await reader.authenticate();

      const useApiKeyMock = GoogleSpreadsheetMock.mock.instances[0].useApiKey;
      expect(useApiKeyMock).toHaveBeenCalledTimes(1);
      expect(useApiKeyMock).toHaveBeenLastCalledWith(dummyApiKey);
    });

    it("throw if service account nor api key found", async () => {
      expect.assertions(1);
      const expectedError = new MissingAuthError();

      const reader = new SpreadsheetReader("test-sheet-id", "*");

      await expect(reader.authenticate()).rejects.toHaveProperty(
        "message",
        expectedError.message
      );
    });
  });
});
