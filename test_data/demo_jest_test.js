/* eslint-env jest */

/**
 * Unit tests for Att1ViewModeService
 *
 * @module test/Att1ViewModeService
 */
import Att1ViewModeService from "js/Att1ViewModeService";

describe("testing  Att1ViewModeServiceTest", function () {
  var _Att1ViewModeService = null;

  beforeEach(function () {
    _Att1ViewModeService = Att1ViewModeService;
  });

  it("testing changeViewMode ", function () {
    var parametersTableViewMode = { viewModeContext: "initialMode" };
    var viewMode = "updatedMode";
    _Att1ViewModeService.changeViewMode(parametersTableViewMode, viewMode);
    expect(parametersTableViewMode.viewModeContext).toBe("updatedMode");
  });

  it("testing getViewMode ", function () {
    var parametersTableViewMode = {
      viewModeContext: undefined,
    };
    var selected = {
      modelType: {
        typeHierarchyArray: "Att1ParameterPrjElement",
      },
    };
    const result = _Att1ViewModeService.getViewMode(
      parametersTableViewMode,
      selected
    );
    expect(parametersTableViewMode.viewModeContext).toBe("updatedMode");
    expect(result).toBe("updatedMode");
  });

  it("testing setAvailableViewModes ", function () {
    var parametersTableViewMode = {};
    var viewModes = ["mode1", "mode2", "mode3"];
    _Att1ViewModeService.setAvailableViewModes(
      parametersTableViewMode,
      viewModes
    );
    expect(parametersTableViewMode.supportedViewModes).toEqual({
      mode1: {},
      mode2: {},
      mode3: {},
    });
  });

  it("testing getAvailableViewModes ", function () {
    const parametersTableViewMode = {
      supportedViewModes: {
        mode1: {},
        mode2: {},
        mode3: {},
      },
    };
    const result = _Att1ViewModeService.getAvailableViewModes(
      parametersTableViewMode
    );
    expect(result).toEqual(["mode1", "mode2", "mode3"]);
  });
});

it("testing changeViewMode ", function () {
  var parametersTableViewMode = { viewModeContext: "initialMode" };
  var viewMode = "updatedMode";
  _Att1ViewModeService.changeViewMode(parametersTableViewMode, viewMode);
});
