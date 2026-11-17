(function() {
  const n = document.createElement("link").relList;
  if (n && n.supports && n.supports("modulepreload")) return;
  for (const r of document.querySelectorAll('link[rel="modulepreload"]')) e(r);
  new MutationObserver((r) => {
    for (const o of r) if (o.type === "childList") for (const a of o.addedNodes) a.tagName === "LINK" && a.rel === "modulepreload" && e(a);
  }).observe(document, { childList: true, subtree: true });
  function t(r) {
    const o = {};
    return r.integrity && (o.integrity = r.integrity), r.referrerPolicy && (o.referrerPolicy = r.referrerPolicy), r.crossOrigin === "use-credentials" ? o.credentials = "include" : r.crossOrigin === "anonymous" ? o.credentials = "omit" : o.credentials = "same-origin", o;
  }
  function e(r) {
    if (r.ep) return;
    r.ep = true;
    const o = t(r);
    fetch(r.href, o);
  }
})();
var Ii = (() => {
  var u = import.meta.url;
  return (async function(n = {}) {
    var t, e = n, r, o, a = new Promise((c, d) => {
      r = c, o = d;
    });
    ["_EPDF_GetMetaKeyCount", "_EPDF_GetMetaKeyName", "_EPDF_GetMetaTrapped", "_EPDF_GetPageBoxByIndex", "_EPDF_GetPageRotationByIndex", "_EPDF_GetPageSizeByIndexNormalized", "_EPDF_HasMetaText", "_EPDF_IsEncrypted", "_EPDF_IsOwnerUnlocked", "_EPDF_LoadPageNormalized", "_EPDF_PNG_EncodeRGBA", "_EPDF_RemoveEncryption", "_EPDF_RenderAnnotBitmap", "_EPDF_RenderAnnotBitmapUnrotated", "_EPDF_SetEncryption", "_EPDF_SetMetaText", "_EPDF_SetMetaTrapped", "_EPDF_UnlockOwnerPermissions", "_EPDFAction_CreateGoTo", "_EPDFAction_CreateGoToNamed", "_EPDFAction_CreateLaunch", "_EPDFAction_CreateRemoteGoToByName", "_EPDFAction_CreateRemoteGoToDest", "_EPDFAction_CreateURI", "_EPDFAnnot_ApplyRedaction", "_EPDFAnnot_ClearBorderEffect", "_EPDFAnnot_ClearColor", "_EPDFAnnot_ClearMKColor", "_EPDFAnnot_ClearRectangleDifferences", "_EPDFAnnot_ExportAppearanceAsDocument", "_EPDFAnnot_ExportMultipleAppearancesAsDocument", "_EPDFAnnot_Flatten", "_EPDFAnnot_GenerateAppearance", "_EPDFAnnot_GenerateAppearanceWithBlend", "_EPDFAnnot_GenerateFormFieldAP", "_EPDFAnnot_GetAPMatrix", "_EPDFAnnot_GetAvailableAppearanceModes", "_EPDFAnnot_GetBlendMode", "_EPDFAnnot_GetBorderDashPattern", "_EPDFAnnot_GetBorderDashPatternCount", "_EPDFAnnot_GetBorderEffect", "_EPDFAnnot_GetBorderStyle", "_EPDFAnnot_GetButtonExportValue", "_EPDFAnnot_GetCalloutLine", "_EPDFAnnot_GetCalloutLineCount", "_EPDFAnnot_GetColor", "_EPDFAnnot_GetDefaultAppearance", "_EPDFAnnot_GetExtendedRotation", "_EPDFAnnot_GetFormFieldObjectNumber", "_EPDFAnnot_GetFormFieldRawValue", "_EPDFAnnot_GetIntent", "_EPDFAnnot_GetLineEndings", "_EPDFAnnot_GetMKColor", "_EPDFAnnot_GetName", "_EPDFAnnot_GetObjectNumber", "_EPDFAnnot_GetOpacity", "_EPDFAnnot_GetOverlayText", "_EPDFAnnot_GetOverlayTextRepeat", "_EPDFAnnot_GetRect", "_EPDFAnnot_GetRectangleDifferences", "_EPDFAnnot_GetReplyType", "_EPDFAnnot_GetRichContent", "_EPDFAnnot_GetRotate", "_EPDFAnnot_GetTextAlignment", "_EPDFAnnot_GetUnrotatedRect", "_EPDFAnnot_GetVerticalAlignment", "_EPDFAnnot_HasAppearanceStream", "_EPDFAnnot_SetAction", "_EPDFAnnot_SetAPMatrix", "_EPDFAnnot_SetAppearanceFromPage", "_EPDFAnnot_SetBorderDashPattern", "_EPDFAnnot_SetBorderEffect", "_EPDFAnnot_SetBorderStyle", "_EPDFAnnot_SetCalloutLine", "_EPDFAnnot_SetColor", "_EPDFAnnot_SetDefaultAppearance", "_EPDFAnnot_SetExtendedRotation", "_EPDFAnnot_SetFormFieldName", "_EPDFAnnot_SetFormFieldOptions", "_EPDFAnnot_SetFormFieldValue", "_EPDFAnnot_SetIntent", "_EPDFAnnot_SetLine", "_EPDFAnnot_SetLineEndings", "_EPDFAnnot_SetLinkedAnnot", "_EPDFAnnot_SetMKColor", "_EPDFAnnot_SetName", "_EPDFAnnot_SetNumberValue", "_EPDFAnnot_SetOpacity", "_EPDFAnnot_SetOverlayText", "_EPDFAnnot_SetOverlayTextRepeat", "_EPDFAnnot_SetRectangleDifferences", "_EPDFAnnot_SetReplyType", "_EPDFAnnot_SetRotate", "_EPDFAnnot_SetTextAlignment", "_EPDFAnnot_SetUnrotatedRect", "_EPDFAnnot_SetVerticalAlignment", "_EPDFAnnot_SetVertices", "_EPDFAnnot_ShareFormField", "_EPDFAnnot_UpdateAppearanceToRect", "_EPDFAttachment_GetDescription", "_EPDFAttachment_GetIntegerValue", "_EPDFAttachment_SetDescription", "_EPDFAttachment_SetSubtype", "_EPDFBookmark_AppendChild", "_EPDFBookmark_Clear", "_EPDFBookmark_ClearTarget", "_EPDFBookmark_Create", "_EPDFBookmark_Delete", "_EPDFBookmark_InsertAfter", "_EPDFBookmark_SetAction", "_EPDFBookmark_SetDest", "_EPDFBookmark_SetTitle", "_EPDFCatalog_GetLanguage", "_EPDFDest_CreateRemoteView", "_EPDFDest_CreateRemoteXYZ", "_EPDFDest_CreateView", "_EPDFDest_CreateXYZ", "_EPDFDoc_GetPageObjectNumberByIndex", "_EPDFDoc_LoadPageByObjectNumber", "_EPDFImageObj_SetJpeg", "_EPDFImageObj_SetPng", "_EPDFNamedDest_Remove", "_EPDFNamedDest_SetDest", "_EPDFPage_ApplyRedactions", "_EPDFPage_CreateAnnot", "_EPDFPage_CreateFormField", "_EPDFPage_GetAnnotByName", "_EPDFPage_GetAnnotByObjectNumber", "_EPDFPage_GetAnnotCountRaw", "_EPDFPage_GetAnnotRaw", "_EPDFPage_GetObjectNumber", "_EPDFPage_MoveAnnots", "_EPDFPage_RemoveAnnot", "_EPDFPage_RemoveAnnotByName", "_EPDFPage_RemoveAnnotByObjectNumber", "_EPDFPage_RemoveAnnotRaw", "_EPDFText_RedactInQuads", "_EPDFText_RedactInRect", "_FORM_CanRedo", "_FORM_CanUndo", "_FORM_DoDocumentAAction", "_FORM_DoDocumentJSAction", "_FORM_DoDocumentOpenAction", "_FORM_DoPageAAction", "_FORM_ForceToKillFocus", "_FORM_GetFocusedAnnot", "_FORM_GetFocusedText", "_FORM_GetSelectedText", "_FORM_IsIndexSelected", "_FORM_OnAfterLoadPage", "_FORM_OnBeforeClosePage", "_FORM_OnChar", "_FORM_OnFocus", "_FORM_OnKeyDown", "_FORM_OnKeyUp", "_FORM_OnLButtonDoubleClick", "_FORM_OnLButtonDown", "_FORM_OnLButtonUp", "_FORM_OnMouseMove", "_FORM_OnMouseWheel", "_FORM_OnRButtonDown", "_FORM_OnRButtonUp", "_FORM_Redo", "_FORM_ReplaceAndKeepSelection", "_FORM_ReplaceSelection", "_FORM_SelectAllText", "_FORM_SetFocusedAnnot", "_FORM_SetIndexSelected", "_FORM_Undo", "_FPDF_AddInstalledFont", "_FPDF_CloseDocument", "_FPDF_ClosePage", "_FPDF_CloseXObject", "_FPDF_CopyViewerPreferences", "_FPDF_CountNamedDests", "_FPDF_CreateClipPath", "_FPDF_CreateNewDocument", "_FPDF_DestroyClipPath", "_FPDF_DestroyLibrary", "_FPDF_DeviceToPage", "_FPDF_DocumentHasValidCrossReferenceTable", "_FPDF_FFLDraw", "_FPDF_FreeDefaultSystemFontInfo", "_FPDF_GetDefaultSystemFontInfo", "_FPDF_GetDefaultTTFMap", "_FPDF_GetDefaultTTFMapCount", "_FPDF_GetDefaultTTFMapEntry", "_FPDF_GetDocPermissions", "_FPDF_GetDocUserPermissions", "_FPDF_GetFileIdentifier", "_FPDF_GetFileVersion", "_FPDF_GetFormType", "_FPDF_GetLastError", "_FPDF_GetMetaText", "_FPDF_GetNamedDest", "_FPDF_GetNamedDestByName", "_FPDF_GetPageAAction", "_FPDF_GetPageBoundingBox", "_FPDF_GetPageCount", "_FPDF_GetPageHeight", "_FPDF_GetPageHeightF", "_FPDF_GetPageLabel", "_FPDF_GetPageSizeByIndex", "_FPDF_GetPageSizeByIndexF", "_FPDF_GetPageWidth", "_FPDF_GetPageWidthF", "_FPDF_GetSecurityHandlerRevision", "_FPDF_GetSignatureCount", "_FPDF_GetSignatureObject", "_FPDF_GetTrailerEnds", "_FPDF_GetXFAPacketContent", "_FPDF_GetXFAPacketCount", "_FPDF_GetXFAPacketName", "_FPDF_ImportNPagesToOne", "_FPDF_ImportPages", "_FPDF_ImportPagesByIndex", "_FPDF_InitLibrary", "_FPDF_InitLibraryWithConfig", "_FPDF_LoadCustomDocument", "_FPDF_LoadDocument", "_FPDF_LoadMemDocument", "_FPDF_LoadMemDocument64", "_FPDF_LoadPage", "_FPDF_LoadXFA", "_FPDF_MovePages", "_FPDF_NewFormObjectFromXObject", "_FPDF_NewXObjectFromPage", "_FPDF_PageToDevice", "_FPDF_RemoveFormFieldHighlight", "_FPDF_RenderPage_Close", "_FPDF_RenderPage_Continue", "_FPDF_RenderPageBitmap", "_FPDF_RenderPageBitmap_Start", "_FPDF_RenderPageBitmapWithColorScheme_Start", "_FPDF_RenderPageBitmapWithMatrix", "_FPDF_SaveAsCopy", "_FPDF_SaveWithVersion", "_FPDF_SetFormFieldHighlightAlpha", "_FPDF_SetFormFieldHighlightColor", "_FPDF_SetSandBoxPolicy", "_FPDF_SetSystemFontInfo", "_FPDF_StructElement_Attr_CountChildren", "_FPDF_StructElement_Attr_GetBlobValue", "_FPDF_StructElement_Attr_GetBooleanValue", "_FPDF_StructElement_Attr_GetChildAtIndex", "_FPDF_StructElement_Attr_GetCount", "_FPDF_StructElement_Attr_GetName", "_FPDF_StructElement_Attr_GetNumberValue", "_FPDF_StructElement_Attr_GetStringValue", "_FPDF_StructElement_Attr_GetType", "_FPDF_StructElement_Attr_GetValue", "_FPDF_StructElement_CountChildren", "_FPDF_StructElement_GetActualText", "_FPDF_StructElement_GetAltText", "_FPDF_StructElement_GetAttributeAtIndex", "_FPDF_StructElement_GetAttributeCount", "_FPDF_StructElement_GetChildAtIndex", "_FPDF_StructElement_GetChildMarkedContentID", "_FPDF_StructElement_GetID", "_FPDF_StructElement_GetLang", "_FPDF_StructElement_GetMarkedContentID", "_FPDF_StructElement_GetMarkedContentIdAtIndex", "_FPDF_StructElement_GetMarkedContentIdCount", "_FPDF_StructElement_GetObjType", "_FPDF_StructElement_GetParent", "_FPDF_StructElement_GetStringAttribute", "_FPDF_StructElement_GetTitle", "_FPDF_StructElement_GetType", "_FPDF_StructTree_Close", "_FPDF_StructTree_CountChildren", "_FPDF_StructTree_GetChildAtIndex", "_FPDF_StructTree_GetForPage", "_FPDF_VIEWERREF_GetDuplex", "_FPDF_VIEWERREF_GetName", "_FPDF_VIEWERREF_GetNumCopies", "_FPDF_VIEWERREF_GetPrintPageRange", "_FPDF_VIEWERREF_GetPrintPageRangeCount", "_FPDF_VIEWERREF_GetPrintPageRangeElement", "_FPDF_VIEWERREF_GetPrintScaling", "_FPDFAction_GetDest", "_FPDFAction_GetFilePath", "_FPDFAction_GetType", "_FPDFAction_GetURIPath", "_FPDFAnnot_AddFileAttachment", "_FPDFAnnot_AddInkStroke", "_FPDFAnnot_AppendAttachmentPoints", "_FPDFAnnot_AppendObject", "_FPDFAnnot_CountAttachmentPoints", "_FPDFAnnot_GetAP", "_FPDFAnnot_GetAttachmentPoints", "_FPDFAnnot_GetBorder", "_FPDFAnnot_GetColor", "_FPDFAnnot_GetFileAttachment", "_FPDFAnnot_GetFlags", "_FPDFAnnot_GetFocusableSubtypes", "_FPDFAnnot_GetFocusableSubtypesCount", "_FPDFAnnot_GetFontColor", "_FPDFAnnot_GetFontSize", "_FPDFAnnot_GetFormAdditionalActionJavaScript", "_FPDFAnnot_GetFormControlCount", "_FPDFAnnot_GetFormControlIndex", "_FPDFAnnot_GetFormFieldAlternateName", "_FPDFAnnot_GetFormFieldAtPoint", "_FPDFAnnot_GetFormFieldExportValue", "_FPDFAnnot_GetFormFieldFlags", "_FPDFAnnot_GetFormFieldName", "_FPDFAnnot_GetFormFieldType", "_FPDFAnnot_GetFormFieldValue", "_FPDFAnnot_GetInkListCount", "_FPDFAnnot_GetInkListPath", "_FPDFAnnot_GetLine", "_FPDFAnnot_GetLink", "_FPDFAnnot_GetLinkedAnnot", "_FPDFAnnot_GetNumberValue", "_FPDFAnnot_GetObject", "_FPDFAnnot_GetObjectCount", "_FPDFAnnot_GetOptionCount", "_FPDFAnnot_GetOptionLabel", "_FPDFAnnot_GetRect", "_FPDFAnnot_GetStringValue", "_FPDFAnnot_GetSubtype", "_FPDFAnnot_GetValueType", "_FPDFAnnot_GetVertices", "_FPDFAnnot_HasAttachmentPoints", "_FPDFAnnot_HasKey", "_FPDFAnnot_IsChecked", "_FPDFAnnot_IsObjectSupportedSubtype", "_FPDFAnnot_IsOptionSelected", "_FPDFAnnot_IsSupportedSubtype", "_FPDFAnnot_RemoveInkList", "_FPDFAnnot_RemoveObject", "_FPDFAnnot_SetAP", "_FPDFAnnot_SetAttachmentPoints", "_FPDFAnnot_SetBorder", "_FPDFAnnot_SetColor", "_FPDFAnnot_SetFlags", "_FPDFAnnot_SetFocusableSubtypes", "_FPDFAnnot_SetFontColor", "_FPDFAnnot_SetFormFieldFlags", "_FPDFAnnot_SetRect", "_FPDFAnnot_SetStringValue", "_FPDFAnnot_SetURI", "_FPDFAnnot_UpdateObject", "_FPDFAttachment_GetFile", "_FPDFAttachment_GetName", "_FPDFAttachment_GetStringValue", "_FPDFAttachment_GetSubtype", "_FPDFAttachment_GetValueType", "_FPDFAttachment_HasKey", "_FPDFAttachment_SetFile", "_FPDFAttachment_SetStringValue", "_FPDFAvail_Create", "_FPDFAvail_Destroy", "_FPDFAvail_GetDocument", "_FPDFAvail_GetFirstPageNum", "_FPDFAvail_IsDocAvail", "_FPDFAvail_IsFormAvail", "_FPDFAvail_IsLinearized", "_FPDFAvail_IsPageAvail", "_FPDFBitmap_Create", "_FPDFBitmap_CreateEx", "_FPDFBitmap_Destroy", "_FPDFBitmap_FillRect", "_FPDFBitmap_GetBuffer", "_FPDFBitmap_GetFormat", "_FPDFBitmap_GetHeight", "_FPDFBitmap_GetStride", "_FPDFBitmap_GetWidth", "_FPDFBookmark_Find", "_FPDFBookmark_GetAction", "_FPDFBookmark_GetCount", "_FPDFBookmark_GetDest", "_FPDFBookmark_GetFirstChild", "_FPDFBookmark_GetNextSibling", "_FPDFBookmark_GetTitle", "_FPDFCatalog_GetLanguage", "_FPDFCatalog_IsTagged", "_FPDFCatalog_SetLanguage", "_FPDFClipPath_CountPaths", "_FPDFClipPath_CountPathSegments", "_FPDFClipPath_GetPathSegment", "_FPDFDest_GetDestPageIndex", "_FPDFDest_GetLocationInPage", "_FPDFDest_GetView", "_FPDFDoc_AddAttachment", "_FPDFDoc_CloseJavaScriptAction", "_FPDFDoc_DeleteAttachment", "_FPDFDOC_ExitFormFillEnvironment", "_FPDFDoc_GetAttachment", "_FPDFDoc_GetAttachmentCount", "_FPDFDoc_GetJavaScriptAction", "_FPDFDoc_GetJavaScriptActionCount", "_FPDFDoc_GetPageMode", "_FPDFDOC_InitFormFillEnvironment", "_FPDFFont_Close", "_FPDFFont_GetAscent", "_FPDFFont_GetBaseFontName", "_FPDFFont_GetDescent", "_FPDFFont_GetFamilyName", "_FPDFFont_GetFlags", "_FPDFFont_GetFontData", "_FPDFFont_GetGlyphPath", "_FPDFFont_GetGlyphWidth", "_FPDFFont_GetIsEmbedded", "_FPDFFont_GetItalicAngle", "_FPDFFont_GetWeight", "_FPDFFormObj_CountObjects", "_FPDFFormObj_GetObject", "_FPDFFormObj_RemoveObject", "_FPDFGlyphPath_CountGlyphSegments", "_FPDFGlyphPath_GetGlyphPathSegment", "_FPDFImageObj_GetBitmap", "_FPDFImageObj_GetIccProfileDataDecoded", "_FPDFImageObj_GetImageDataDecoded", "_FPDFImageObj_GetImageDataRaw", "_FPDFImageObj_GetImageFilter", "_FPDFImageObj_GetImageFilterCount", "_FPDFImageObj_GetImageMetadata", "_FPDFImageObj_GetImagePixelSize", "_FPDFImageObj_GetRenderedBitmap", "_FPDFImageObj_LoadJpegFile", "_FPDFImageObj_LoadJpegFileInline", "_FPDFImageObj_SetBitmap", "_FPDFImageObj_SetMatrix", "_FPDFJavaScriptAction_GetName", "_FPDFJavaScriptAction_GetScript", "_FPDFLink_CloseWebLinks", "_FPDFLink_CountQuadPoints", "_FPDFLink_CountRects", "_FPDFLink_CountWebLinks", "_FPDFLink_Enumerate", "_FPDFLink_GetAction", "_FPDFLink_GetAnnot", "_FPDFLink_GetAnnotRect", "_FPDFLink_GetDest", "_FPDFLink_GetLinkAtPoint", "_FPDFLink_GetLinkZOrderAtPoint", "_FPDFLink_GetQuadPoints", "_FPDFLink_GetRect", "_FPDFLink_GetTextRange", "_FPDFLink_GetURL", "_FPDFLink_LoadWebLinks", "_FPDFPage_CloseAnnot", "_FPDFPage_CountObjects", "_FPDFPage_CreateAnnot", "_FPDFPage_Delete", "_FPDFPage_Flatten", "_FPDFPage_FormFieldZOrderAtPoint", "_FPDFPage_GenerateContent", "_FPDFPage_GetAnnot", "_FPDFPage_GetAnnotCount", "_FPDFPage_GetAnnotIndex", "_FPDFPage_GetArtBox", "_FPDFPage_GetBleedBox", "_FPDFPage_GetCropBox", "_FPDFPage_GetDecodedThumbnailData", "_FPDFPage_GetMediaBox", "_FPDFPage_GetObject", "_FPDFPage_GetRawThumbnailData", "_FPDFPage_GetRotation", "_FPDFPage_GetThumbnailAsBitmap", "_FPDFPage_GetTrimBox", "_FPDFPage_HasFormFieldAtPoint", "_FPDFPage_HasTransparency", "_FPDFPage_InsertClipPath", "_FPDFPage_InsertObject", "_FPDFPage_InsertObjectAtIndex", "_FPDFPage_New", "_FPDFPage_RemoveAnnot", "_FPDFPage_RemoveObject", "_FPDFPage_SetArtBox", "_FPDFPage_SetBleedBox", "_FPDFPage_SetCropBox", "_FPDFPage_SetMediaBox", "_FPDFPage_SetRotation", "_FPDFPage_SetTrimBox", "_FPDFPage_TransformAnnots", "_FPDFPage_TransFormWithClip", "_FPDFPageObj_AddMark", "_FPDFPageObj_CountMarks", "_FPDFPageObj_CreateNewPath", "_FPDFPageObj_CreateNewRect", "_FPDFPageObj_CreateTextObj", "_FPDFPageObj_Destroy", "_FPDFPageObj_GetBounds", "_FPDFPageObj_GetClipPath", "_FPDFPageObj_GetDashArray", "_FPDFPageObj_GetDashCount", "_FPDFPageObj_GetDashPhase", "_FPDFPageObj_GetFillColor", "_FPDFPageObj_GetIsActive", "_FPDFPageObj_GetLineCap", "_FPDFPageObj_GetLineJoin", "_FPDFPageObj_GetMark", "_FPDFPageObj_GetMarkedContentID", "_FPDFPageObj_GetMatrix", "_FPDFPageObj_GetRotatedBounds", "_FPDFPageObj_GetStrokeColor", "_FPDFPageObj_GetStrokeWidth", "_FPDFPageObj_GetType", "_FPDFPageObj_HasTransparency", "_FPDFPageObj_NewImageObj", "_FPDFPageObj_NewTextObj", "_FPDFPageObj_RemoveMark", "_FPDFPageObj_SetBlendMode", "_FPDFPageObj_SetDashArray", "_FPDFPageObj_SetDashPhase", "_FPDFPageObj_SetFillColor", "_FPDFPageObj_SetIsActive", "_FPDFPageObj_SetLineCap", "_FPDFPageObj_SetLineJoin", "_FPDFPageObj_SetMatrix", "_FPDFPageObj_SetStrokeColor", "_FPDFPageObj_SetStrokeWidth", "_FPDFPageObj_Transform", "_FPDFPageObj_TransformClipPath", "_FPDFPageObj_TransformF", "_FPDFPageObjMark_CountParams", "_FPDFPageObjMark_GetName", "_FPDFPageObjMark_GetParamBlobValue", "_FPDFPageObjMark_GetParamFloatValue", "_FPDFPageObjMark_GetParamIntValue", "_FPDFPageObjMark_GetParamKey", "_FPDFPageObjMark_GetParamStringValue", "_FPDFPageObjMark_GetParamValueType", "_FPDFPageObjMark_RemoveParam", "_FPDFPageObjMark_SetBlobParam", "_FPDFPageObjMark_SetFloatParam", "_FPDFPageObjMark_SetIntParam", "_FPDFPageObjMark_SetStringParam", "_FPDFPath_BezierTo", "_FPDFPath_Close", "_FPDFPath_CountSegments", "_FPDFPath_GetDrawMode", "_FPDFPath_GetPathSegment", "_FPDFPath_LineTo", "_FPDFPath_MoveTo", "_FPDFPath_SetDrawMode", "_FPDFPathSegment_GetClose", "_FPDFPathSegment_GetPoint", "_FPDFPathSegment_GetType", "_FPDFSignatureObj_GetByteRange", "_FPDFSignatureObj_GetContents", "_FPDFSignatureObj_GetDocMDPPermission", "_FPDFSignatureObj_GetReason", "_FPDFSignatureObj_GetSubFilter", "_FPDFSignatureObj_GetTime", "_FPDFText_ClosePage", "_FPDFText_CountChars", "_FPDFText_CountRects", "_FPDFText_FindClose", "_FPDFText_FindNext", "_FPDFText_FindPrev", "_FPDFText_FindStart", "_FPDFText_GetBoundedText", "_FPDFText_GetCharAngle", "_FPDFText_GetCharBox", "_FPDFText_GetCharIndexAtPos", "_FPDFText_GetCharIndexFromTextIndex", "_FPDFText_GetCharOrigin", "_FPDFText_GetFillColor", "_FPDFText_GetFontInfo", "_FPDFText_GetFontSize", "_FPDFText_GetFontWeight", "_FPDFText_GetLooseCharBox", "_FPDFText_GetMatrix", "_FPDFText_GetRect", "_FPDFText_GetSchCount", "_FPDFText_GetSchResultIndex", "_FPDFText_GetStrokeColor", "_FPDFText_GetText", "_FPDFText_GetTextIndexFromCharIndex", "_FPDFText_GetTextObject", "_FPDFText_GetUnicode", "_FPDFText_HasUnicodeMapError", "_FPDFText_IsGenerated", "_FPDFText_IsHyphen", "_FPDFText_LoadCidType2Font", "_FPDFText_LoadFont", "_FPDFText_LoadPage", "_FPDFText_LoadStandardFont", "_FPDFText_SetCharcodes", "_FPDFText_SetText", "_FPDFTextObj_GetFont", "_FPDFTextObj_GetFontSize", "_FPDFTextObj_GetRenderedBitmap", "_FPDFTextObj_GetText", "_FPDFTextObj_GetTextRenderMode", "_FPDFTextObj_SetTextRenderMode", "_PDFiumExt_CloseFileWriter", "_PDFiumExt_CloseFormFillInfo", "_PDFiumExt_ExitFormFillEnvironment", "_PDFiumExt_GetFileWriterData", "_PDFiumExt_GetFileWriterSize", "_PDFiumExt_Init", "_PDFiumExt_InitFormFillEnvironment", "_PDFiumExt_OpenFileWriter", "_PDFiumExt_OpenFormFillInfo", "_PDFiumExt_SaveAsCopy", "_malloc", "_free", "_memory", "___indirect_function_table", "onRuntimeInitialized"].forEach((c) => {
      Object.getOwnPropertyDescriptor(a, c) || Object.defineProperty(a, c, { get: () => Le("You are getting " + c + " on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js"), set: () => Le("You are setting " + c + " on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js") });
    });
    var s = typeof window == "object", i = typeof importScripts == "function";
    typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string" && process.type != "renderer";
    var l = !s && true && !i, h = Object.assign({}, e), m = "./this.program", _ = "";
    function p(c) {
      return e.locateFile ? e.locateFile(c, _) : _ + c;
    }
    var P, D;
    if (l) {
      if (typeof window == "object" || typeof importScripts == "function") throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
      D = (c) => {
        if (typeof readbuffer == "function") return new Uint8Array(readbuffer(c));
        let d = read(c, "binary");
        return E(typeof d == "object"), d;
      }, P = (c) => new Promise((d, b) => {
        setTimeout(() => d(D(c)));
      }), globalThis.clearTimeout ??= (c) => {
      }, globalThis.setTimeout ??= (c) => typeof c == "function" ? c() : Le(), typeof print < "u" && (globalThis.console ??= {}, console.log = print, console.warn = console.error = globalThis.printErr ?? print);
    } else if (s || i) {
      if (i ? _ = self.location.href : typeof document < "u" && document.currentScript && (_ = document.currentScript.src), u && (_ = u), _.startsWith("blob:") ? _ = "" : _ = _.substr(0, _.replace(/[?#].*/, "").lastIndexOf("/") + 1), !(typeof window == "object" || typeof importScripts == "function")) throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
      i && (D = (c) => {
        var d = new XMLHttpRequest();
        return d.open("GET", c, false), d.responseType = "arraybuffer", d.send(null), new Uint8Array(d.response);
      }), P = (c) => (E(!Qe(c), "readAsync does not work with file:// URLs"), fetch(c, { credentials: "same-origin" }).then((d) => d.ok ? d.arrayBuffer() : Promise.reject(new Error(d.status + " : " + d.url))));
    } else throw new Error("environment detection error");
    var x = e.print || console.log.bind(console), A = e.printErr || console.error.bind(console);
    Object.assign(e, h), h = null, bi(), e.arguments && e.arguments, mt("arguments", "arguments_"), e.thisProgram && (m = e.thisProgram), mt("thisProgram", "thisProgram"), E(typeof e.memoryInitializerPrefixURL > "u", "Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead"), E(typeof e.pthreadMainPrefixURL > "u", "Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead"), E(typeof e.cdInitializerPrefixURL > "u", "Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead"), E(typeof e.filePackagePrefixURL > "u", "Module.filePackagePrefixURL option was removed, use Module.locateFile instead"), E(typeof e.read > "u", "Module.read option was removed"), E(typeof e.readAsync > "u", "Module.readAsync option was removed (modify readAsync in JS)"), E(typeof e.readBinary > "u", "Module.readBinary option was removed (modify readBinary in JS)"), E(typeof e.setWindowTitle > "u", "Module.setWindowTitle option was removed (modify emscripten_set_window_title in JS)"), E(typeof e.TOTAL_MEMORY > "u", "Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY"), mt("asm", "wasmExports"), mt("readAsync", "readAsync"), mt("readBinary", "readBinary"), mt("setWindowTitle", "setWindowTitle");
    var w = e.wasmBinary;
    mt("wasmBinary", "wasmBinary"), typeof WebAssembly != "object" && A("no native wasm support detected");
    var k, G = false;
    function E(c, d) {
      c || Le("Assertion failed" + (d ? ": " + d : ""));
    }
    var B, z, O, W, N, V, q, Y;
    function ne() {
      var c = k.buffer;
      e.HEAP8 = B = new Int8Array(c), e.HEAP16 = O = new Int16Array(c), e.HEAPU8 = z = new Uint8Array(c), e.HEAPU16 = W = new Uint16Array(c), e.HEAP32 = N = new Int32Array(c), e.HEAPU32 = V = new Uint32Array(c), e.HEAPF32 = q = new Float32Array(c), e.HEAPF64 = Y = new Float64Array(c);
    }
    E(!e.STACK_SIZE, "STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time"), E(typeof Int32Array < "u" && typeof Float64Array < "u" && Int32Array.prototype.subarray != null && Int32Array.prototype.set != null, "JS engine does not provide full typed array support"), E(!e.wasmMemory, "Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally"), E(!e.INITIAL_MEMORY, "Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically");
    function J() {
      var c = Hr();
      E((c & 3) == 0), c == 0 && (c += 4), V[c >> 2] = 34821223, V[c + 4 >> 2] = 2310721022, V[0] = 1668509029;
    }
    function ee() {
      if (!G) {
        var c = Hr();
        c == 0 && (c += 4);
        var d = V[c >> 2], b = V[c + 4 >> 2];
        (d != 34821223 || b != 2310721022) && Le(`Stack overflow! Stack cookie has been overwritten at ${st(c)}, expected hex dwords 0x89BACDFE and 0x2135467, but received ${st(b)} ${st(d)}`), V[0] != 1668509029 && Le("Runtime error: The application has corrupted its heap memory area (address zero)!");
      }
    }
    var ae = [], de = [], oe = [], fe = false;
    function we() {
      var c = e.preRun;
      c && (typeof c == "function" && (c = [c]), c.forEach(ge)), Mt(ae);
    }
    function ce() {
      E(!fe), fe = true, ee(), !e.noFSInit && !F.initialized && F.init(), F.ignorePermissions = false, Mt(de);
    }
    function Ge() {
      ee();
      var c = e.postRun;
      c && (typeof c == "function" && (c = [c]), c.forEach(Ce)), Mt(oe);
    }
    function ge(c) {
      ae.unshift(c);
    }
    function $e(c) {
      de.unshift(c);
    }
    function Ce(c) {
      oe.unshift(c);
    }
    E(Math.imul, "This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill"), E(Math.fround, "This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill"), E(Math.clz32, "This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill"), E(Math.trunc, "This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
    var Ee = 0, Oe = null, Ke = null, Xe = {};
    function dt(c) {
      for (var d = c; ; ) {
        if (!Xe[c]) return c;
        c = d + Math.random();
      }
    }
    function Rt(c) {
      Ee++, e.monitorRunDependencies?.(Ee), c ? (E(!Xe[c]), Xe[c] = 1, Oe === null && typeof setInterval < "u" && (Oe = setInterval(() => {
        if (G) {
          clearInterval(Oe), Oe = null;
          return;
        }
        var d = false;
        for (var b in Xe) d || (d = true, A("still waiting on run dependencies:")), A(`dependency: ${b}`);
        d && A("(end of list)");
      }, 1e4))) : A("warning: run dependency added without ID");
    }
    function It(c) {
      if (Ee--, e.monitorRunDependencies?.(Ee), c ? (E(Xe[c]), delete Xe[c]) : A("warning: run dependency removed without ID"), Ee == 0 && (Oe !== null && (clearInterval(Oe), Oe = null), Ke)) {
        var d = Ke;
        Ke = null, d();
      }
    }
    function Le(c) {
      e.onAbort?.(c), c = "Aborted(" + c + ")", A(c), G = true;
      var d = new WebAssembly.RuntimeError(c);
      throw o(d), d;
    }
    var Ut = "data:application/octet-stream;base64,", St = (c) => c.startsWith(Ut), Qe = (c) => c.startsWith("file://");
    function f(c, d) {
      return (...b) => {
        E(fe, `native function \`${c}\` called before runtime initialization`);
        var v = Pt[c];
        return E(v, `exported native function \`${c}\` not found`), E(b.length <= d, `native function \`${c}\` called with ${b.length} args but expects ${d}`), v(...b);
      };
    }
    function Ct() {
      if (e.locateFile) {
        var c = "pdfium.wasm";
        return St(c) ? c : p(c);
      }
      return l ? "pdfium.wasm" : new URL("pdfium.wasm", document.baseURI).href;
    }
    var wt;
    function Dn(c) {
      if (c == wt && w) return new Uint8Array(w);
      if (D) return D(c);
      throw "both async and sync fetching of the wasm failed";
    }
    function jn(c) {
      return w ? Promise.resolve().then(() => Dn(c)) : P(c).then((d) => new Uint8Array(d), () => Dn(c));
    }
    function yn(c, d, b) {
      return jn(c).then((v) => WebAssembly.instantiate(v, d)).then(b, (v) => {
        A(`failed to asynchronously prepare wasm: ${v}`), Qe(wt) && A(`warning: Loading from a file URI (${wt}) is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing`), Le(v);
      });
    }
    function zt(c, d, b, v) {
      return !c && typeof WebAssembly.instantiateStreaming == "function" && !St(d) && typeof fetch == "function" ? fetch(d, { credentials: "same-origin" }).then((C) => {
        var T = WebAssembly.instantiateStreaming(C, b);
        return T.then(v, function(U) {
          return A(`wasm streaming compile failed: ${U}`), A("falling back to ArrayBuffer instantiation"), yn(d, b, v);
        });
      }) : yn(d, b, v);
    }
    function bt() {
      return { env: $o, wasi_snapshot_preview1: $o };
    }
    function Bn() {
      var c = bt();
      function d(C, T) {
        return Pt = C.exports, e.wasmExports = Pt, k = Pt.memory, E(k, "memory not found in wasm exports"), ne(), Kt = Pt.__indirect_function_table, E(Kt, "table not found in wasm exports"), $e(Pt.__wasm_call_ctors), It("wasm-instantiate"), Pt;
      }
      Rt("wasm-instantiate");
      var b = e;
      function v(C) {
        E(e === b, "the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?"), b = null, d(C.instance);
      }
      if (e.instantiateWasm) try {
        return e.instantiateWasm(c, d);
      } catch (C) {
        A(`Module.instantiateWasm callback failed with error: ${C}`), o(C);
      }
      return wt ??= Ct(), zt(w, wt, c, v).catch(o), {};
    }
    var be, je;
    if ((() => {
      var c = new Int16Array(1), d = new Int8Array(c.buffer);
      if (c[0] = 25459, d[0] !== 115 || d[1] !== 99) throw "Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)";
    })(), e.ENVIRONMENT) throw new Error("Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)");
    function mt(c, d, b = true) {
      Object.getOwnPropertyDescriptor(e, c) || Object.defineProperty(e, c, { configurable: true, get() {
        let v = b ? " (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)" : "";
        Le(`\`Module.${c}\` has been replaced by \`${d}\`` + v);
      } });
    }
    function wn(c) {
      Object.getOwnPropertyDescriptor(e, c) && Le(`\`Module.${c}\` was supplied but \`${c}\` not included in INCOMING_MODULE_JS_API`);
    }
    function Qt(c) {
      return c === "FS_createPath" || c === "FS_createDataFile" || c === "FS_createPreloadedFile" || c === "FS_unlink" || c === "addRunDependency" || c === "FS_createLazyFile" || c === "FS_createDevice" || c === "removeRunDependency";
    }
    function vn(c, d) {
      typeof globalThis < "u" && !Object.getOwnPropertyDescriptor(globalThis, c) && Object.defineProperty(globalThis, c, { configurable: true, get() {
        d();
      } });
    }
    function cn(c, d) {
      vn(c, () => {
        ht(`\`${c}\` is not longer defined by emscripten. ${d}`);
      });
    }
    cn("buffer", "Please use HEAP8.buffer or wasmMemory.buffer"), cn("asm", "Please use wasmExports instead");
    function xn(c) {
      vn(c, () => {
        var d = `\`${c}\` is a library symbol and not included by default; add it to your library.js __deps or to DEFAULT_LIBRARY_FUNCS_TO_INCLUDE on the command line`, b = c;
        b.startsWith("_") || (b = "$" + c), d += ` (e.g. -sDEFAULT_LIBRARY_FUNCS_TO_INCLUDE='${b}')`, Qt(c) && (d += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you"), ht(d);
      }), ct(c);
    }
    function ct(c) {
      Object.getOwnPropertyDescriptor(e, c) || Object.defineProperty(e, c, { configurable: true, get() {
        var d = `'${c}' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the Emscripten FAQ)`;
        Qt(c) && (d += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you"), Le(d);
      } });
    }
    var Mt = (c) => {
      c.forEach((d) => d(e));
    };
    function un(c, d = "i8") {
      switch (d.endsWith("*") && (d = "*"), d) {
        case "i1":
          return B[c];
        case "i8":
          return B[c];
        case "i16":
          return O[c >> 1];
        case "i32":
          return N[c >> 2];
        case "i64":
          Le("to do getValue(i64) use WASM_BIGINT");
        case "float":
          return q[c >> 2];
        case "double":
          return Y[c >> 3];
        case "*":
          return V[c >> 2];
        default:
          Le(`invalid type for getValue: ${d}`);
      }
    }
    e.noExitRuntime;
    var st = (c) => (E(typeof c == "number"), c >>>= 0, "0x" + c.toString(16).padStart(8, "0"));
    function en(c, d, b = "i8") {
      switch (b.endsWith("*") && (b = "*"), b) {
        case "i1":
          B[c] = d;
          break;
        case "i8":
          B[c] = d;
          break;
        case "i16":
          O[c >> 1] = d;
          break;
        case "i32":
          N[c >> 2] = d;
          break;
        case "i64":
          Le("to do setValue(i64) use WASM_BIGINT");
        case "float":
          q[c >> 2] = d;
          break;
        case "double":
          Y[c >> 3] = d;
          break;
        case "*":
          V[c >> 2] = d;
          break;
        default:
          Le(`invalid type for setValue: ${b}`);
      }
    }
    var rt = (c) => zo(c), ut = () => Wo(), ht = (c) => {
      ht.shown ||= {}, ht.shown[c] || (ht.shown[c] = 1, A(c));
    }, hn = typeof TextDecoder < "u" ? new TextDecoder() : void 0, vt = (c, d = 0, b = NaN) => {
      for (var v = d + b, C = d; c[C] && !(C >= v); ) ++C;
      if (C - d > 16 && c.buffer && hn) return hn.decode(c.subarray(d, C));
      for (var T = ""; d < C; ) {
        var U = c[d++];
        if (!(U & 128)) {
          T += String.fromCharCode(U);
          continue;
        }
        var X = c[d++] & 63;
        if ((U & 224) == 192) {
          T += String.fromCharCode((U & 31) << 6 | X);
          continue;
        }
        var le = c[d++] & 63;
        if ((U & 240) == 224 ? U = (U & 15) << 12 | X << 6 | le : ((U & 248) != 240 && ht("Invalid UTF-8 leading byte " + st(U) + " encountered when deserializing a UTF-8 string in wasm memory to a JS string!"), U = (U & 7) << 18 | X << 12 | le << 6 | c[d++] & 63), U < 65536) T += String.fromCharCode(U);
        else {
          var Pe = U - 65536;
          T += String.fromCharCode(55296 | Pe >> 10, 56320 | Pe & 1023);
        }
      }
      return T;
    }, xt = (c, d) => (E(typeof c == "number", `UTF8ToString expects a number (got ${typeof c})`), c ? vt(z, c, d) : ""), An = (c, d, b, v) => {
      Le(`Assertion failed: ${xt(c)}, at: ` + [d ? xt(d) : "unknown filename", b, v ? xt(v) : "unknown function"]);
    };
    function Gt() {
      E(K.varargs != null);
      var c = N[+K.varargs >> 2];
      return K.varargs += 4, c;
    }
    var At = Gt, Be = { isAbs: (c) => c.charAt(0) === "/", splitPath: (c) => {
      var d = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
      return d.exec(c).slice(1);
    }, normalizeArray: (c, d) => {
      for (var b = 0, v = c.length - 1; v >= 0; v--) {
        var C = c[v];
        C === "." ? c.splice(v, 1) : C === ".." ? (c.splice(v, 1), b++) : b && (c.splice(v, 1), b--);
      }
      if (d) for (; b; b--) c.unshift("..");
      return c;
    }, normalize: (c) => {
      var d = Be.isAbs(c), b = c.substr(-1) === "/";
      return c = Be.normalizeArray(c.split("/").filter((v) => !!v), !d).join("/"), !c && !d && (c = "."), c && b && (c += "/"), (d ? "/" : "") + c;
    }, dirname: (c) => {
      var d = Be.splitPath(c), b = d[0], v = d[1];
      return !b && !v ? "." : (v && (v = v.substr(0, v.length - 1)), b + v);
    }, basename: (c) => {
      if (c === "/") return "/";
      c = Be.normalize(c), c = c.replace(/\/$/, "");
      var d = c.lastIndexOf("/");
      return d === -1 ? c : c.substr(d + 1);
    }, join: (...c) => Be.normalize(c.join("/")), join2: (c, d) => Be.normalize(c + "/" + d) }, qe = () => {
      if (typeof crypto == "object" && typeof crypto.getRandomValues == "function") return (c) => crypto.getRandomValues(c);
      Le("no cryptographic support found for randomDevice. consider polyfilling it if you want to use something insecure like Math.random(), e.g. put this in a --pre-js: var crypto = { getRandomValues: (array) => { for (var i = 0; i < array.length; i++) array[i] = (Math.random()*256)|0 } };");
    }, dn = (c) => (dn = qe())(c), He = { resolve: (...c) => {
      for (var d = "", b = false, v = c.length - 1; v >= -1 && !b; v--) {
        var C = v >= 0 ? c[v] : F.cwd();
        if (typeof C != "string") throw new TypeError("Arguments to path.resolve must be strings");
        if (!C) return "";
        d = C + "/" + d, b = Be.isAbs(C);
      }
      return d = Be.normalizeArray(d.split("/").filter((T) => !!T), !b).join("/"), (b ? "/" : "") + d || ".";
    }, relative: (c, d) => {
      c = He.resolve(c).substr(1), d = He.resolve(d).substr(1);
      function b(Pe) {
        for (var xe = 0; xe < Pe.length && Pe[xe] === ""; xe++) ;
        for (var Se = Pe.length - 1; Se >= 0 && Pe[Se] === ""; Se--) ;
        return xe > Se ? [] : Pe.slice(xe, Se - xe + 1);
      }
      for (var v = b(c.split("/")), C = b(d.split("/")), T = Math.min(v.length, C.length), U = T, X = 0; X < T; X++) if (v[X] !== C[X]) {
        U = X;
        break;
      }
      for (var le = [], X = U; X < v.length; X++) le.push("..");
      return le = le.concat(C.slice(U)), le.join("/");
    } }, et = [], Ht = (c) => {
      for (var d = 0, b = 0; b < c.length; ++b) {
        var v = c.charCodeAt(b);
        v <= 127 ? d++ : v <= 2047 ? d += 2 : v >= 55296 && v <= 57343 ? (d += 4, ++b) : d += 3;
      }
      return d;
    }, M = (c, d, b, v) => {
      if (E(typeof c == "string", `stringToUTF8Array expects a string (got ${typeof c})`), !(v > 0)) return 0;
      for (var C = b, T = b + v - 1, U = 0; U < c.length; ++U) {
        var X = c.charCodeAt(U);
        if (X >= 55296 && X <= 57343) {
          var le = c.charCodeAt(++U);
          X = 65536 + ((X & 1023) << 10) | le & 1023;
        }
        if (X <= 127) {
          if (b >= T) break;
          d[b++] = X;
        } else if (X <= 2047) {
          if (b + 1 >= T) break;
          d[b++] = 192 | X >> 6, d[b++] = 128 | X & 63;
        } else if (X <= 65535) {
          if (b + 2 >= T) break;
          d[b++] = 224 | X >> 12, d[b++] = 128 | X >> 6 & 63, d[b++] = 128 | X & 63;
        } else {
          if (b + 3 >= T) break;
          X > 1114111 && ht("Invalid Unicode code point " + st(X) + " encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF)."), d[b++] = 240 | X >> 18, d[b++] = 128 | X >> 12 & 63, d[b++] = 128 | X >> 6 & 63, d[b++] = 128 | X & 63;
        }
      }
      return d[b] = 0, b - C;
    };
    function he(c, d, b) {
      var v = Ht(c) + 1, C = new Array(v), T = M(c, C, 0, C.length);
      return C.length = T, C;
    }
    var ve = () => {
      if (!et.length) {
        var c = null;
        if (typeof window < "u" && typeof window.prompt == "function" ? (c = window.prompt("Input: "), c !== null && (c += `
`)) : typeof readline == "function" && (c = readline(), c && (c += `
`)), !c) return null;
        et = he(c);
      }
      return et.shift();
    }, Re = { ttys: [], init() {
    }, shutdown() {
    }, register(c, d) {
      Re.ttys[c] = { input: [], output: [], ops: d }, F.registerDevice(c, Re.stream_ops);
    }, stream_ops: { open(c) {
      var d = Re.ttys[c.node.rdev];
      if (!d) throw new F.ErrnoError(43);
      c.tty = d, c.seekable = false;
    }, close(c) {
      c.tty.ops.fsync(c.tty);
    }, fsync(c) {
      c.tty.ops.fsync(c.tty);
    }, read(c, d, b, v, C) {
      if (!c.tty || !c.tty.ops.get_char) throw new F.ErrnoError(60);
      for (var T = 0, U = 0; U < v; U++) {
        var X;
        try {
          X = c.tty.ops.get_char(c.tty);
        } catch {
          throw new F.ErrnoError(29);
        }
        if (X === void 0 && T === 0) throw new F.ErrnoError(6);
        if (X == null) break;
        T++, d[b + U] = X;
      }
      return T && (c.node.timestamp = Date.now()), T;
    }, write(c, d, b, v, C) {
      if (!c.tty || !c.tty.ops.put_char) throw new F.ErrnoError(60);
      try {
        for (var T = 0; T < v; T++) c.tty.ops.put_char(c.tty, d[b + T]);
      } catch {
        throw new F.ErrnoError(29);
      }
      return v && (c.node.timestamp = Date.now()), T;
    } }, default_tty_ops: { get_char(c) {
      return ve();
    }, put_char(c, d) {
      d === null || d === 10 ? (x(vt(c.output)), c.output = []) : d != 0 && c.output.push(d);
    }, fsync(c) {
      c.output && c.output.length > 0 && (x(vt(c.output)), c.output = []);
    }, ioctl_tcgets(c) {
      return { c_iflag: 25856, c_oflag: 5, c_cflag: 191, c_lflag: 35387, c_cc: [3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
    }, ioctl_tcsets(c, d, b) {
      return 0;
    }, ioctl_tiocgwinsz(c) {
      return [24, 80];
    } }, default_tty1_ops: { put_char(c, d) {
      d === null || d === 10 ? (A(vt(c.output)), c.output = []) : d != 0 && c.output.push(d);
    }, fsync(c) {
      c.output && c.output.length > 0 && (A(vt(c.output)), c.output = []);
    } } }, Ne = (c, d) => {
      z.fill(0, c, c + d);
    }, ot = (c, d) => (E(d, "alignment argument is required"), Math.ceil(c / d) * d), Lt = (c) => {
      c = ot(c, 65536);
      var d = yi(65536, c);
      return d && Ne(d, c), d;
    }, Ae = { ops_table: null, mount(c) {
      return Ae.createNode(null, "/", 16895, 0);
    }, createNode(c, d, b, v) {
      if (F.isBlkdev(b) || F.isFIFO(b)) throw new F.ErrnoError(63);
      Ae.ops_table ||= { dir: { node: { getattr: Ae.node_ops.getattr, setattr: Ae.node_ops.setattr, lookup: Ae.node_ops.lookup, mknod: Ae.node_ops.mknod, rename: Ae.node_ops.rename, unlink: Ae.node_ops.unlink, rmdir: Ae.node_ops.rmdir, readdir: Ae.node_ops.readdir, symlink: Ae.node_ops.symlink }, stream: { llseek: Ae.stream_ops.llseek } }, file: { node: { getattr: Ae.node_ops.getattr, setattr: Ae.node_ops.setattr }, stream: { llseek: Ae.stream_ops.llseek, read: Ae.stream_ops.read, write: Ae.stream_ops.write, allocate: Ae.stream_ops.allocate, mmap: Ae.stream_ops.mmap, msync: Ae.stream_ops.msync } }, link: { node: { getattr: Ae.node_ops.getattr, setattr: Ae.node_ops.setattr, readlink: Ae.node_ops.readlink }, stream: {} }, chrdev: { node: { getattr: Ae.node_ops.getattr, setattr: Ae.node_ops.setattr }, stream: F.chrdev_stream_ops } };
      var C = F.createNode(c, d, b, v);
      return F.isDir(C.mode) ? (C.node_ops = Ae.ops_table.dir.node, C.stream_ops = Ae.ops_table.dir.stream, C.contents = {}) : F.isFile(C.mode) ? (C.node_ops = Ae.ops_table.file.node, C.stream_ops = Ae.ops_table.file.stream, C.usedBytes = 0, C.contents = null) : F.isLink(C.mode) ? (C.node_ops = Ae.ops_table.link.node, C.stream_ops = Ae.ops_table.link.stream) : F.isChrdev(C.mode) && (C.node_ops = Ae.ops_table.chrdev.node, C.stream_ops = Ae.ops_table.chrdev.stream), C.timestamp = Date.now(), c && (c.contents[d] = C, c.timestamp = C.timestamp), C;
    }, getFileDataAsTypedArray(c) {
      return c.contents ? c.contents.subarray ? c.contents.subarray(0, c.usedBytes) : new Uint8Array(c.contents) : new Uint8Array(0);
    }, expandFileStorage(c, d) {
      var b = c.contents ? c.contents.length : 0;
      if (!(b >= d)) {
        var v = 1024 * 1024;
        d = Math.max(d, b * (b < v ? 2 : 1.125) >>> 0), b != 0 && (d = Math.max(d, 256));
        var C = c.contents;
        c.contents = new Uint8Array(d), c.usedBytes > 0 && c.contents.set(C.subarray(0, c.usedBytes), 0);
      }
    }, resizeFileStorage(c, d) {
      if (c.usedBytes != d) if (d == 0) c.contents = null, c.usedBytes = 0;
      else {
        var b = c.contents;
        c.contents = new Uint8Array(d), b && c.contents.set(b.subarray(0, Math.min(d, c.usedBytes))), c.usedBytes = d;
      }
    }, node_ops: { getattr(c) {
      var d = {};
      return d.dev = F.isChrdev(c.mode) ? c.id : 1, d.ino = c.id, d.mode = c.mode, d.nlink = 1, d.uid = 0, d.gid = 0, d.rdev = c.rdev, F.isDir(c.mode) ? d.size = 4096 : F.isFile(c.mode) ? d.size = c.usedBytes : F.isLink(c.mode) ? d.size = c.link.length : d.size = 0, d.atime = new Date(c.timestamp), d.mtime = new Date(c.timestamp), d.ctime = new Date(c.timestamp), d.blksize = 4096, d.blocks = Math.ceil(d.size / d.blksize), d;
    }, setattr(c, d) {
      d.mode !== void 0 && (c.mode = d.mode), d.timestamp !== void 0 && (c.timestamp = d.timestamp), d.size !== void 0 && Ae.resizeFileStorage(c, d.size);
    }, lookup(c, d) {
      throw F.genericErrors[44];
    }, mknod(c, d, b, v) {
      return Ae.createNode(c, d, b, v);
    }, rename(c, d, b) {
      if (F.isDir(c.mode)) {
        var v;
        try {
          v = F.lookupNode(d, b);
        } catch {
        }
        if (v) for (var C in v.contents) throw new F.ErrnoError(55);
      }
      delete c.parent.contents[c.name], c.parent.timestamp = Date.now(), c.name = b, d.contents[b] = c, d.timestamp = c.parent.timestamp;
    }, unlink(c, d) {
      delete c.contents[d], c.timestamp = Date.now();
    }, rmdir(c, d) {
      var b = F.lookupNode(c, d);
      for (var v in b.contents) throw new F.ErrnoError(55);
      delete c.contents[d], c.timestamp = Date.now();
    }, readdir(c) {
      var d = [".", ".."];
      for (var b of Object.keys(c.contents)) d.push(b);
      return d;
    }, symlink(c, d, b) {
      var v = Ae.createNode(c, d, 41471, 0);
      return v.link = b, v;
    }, readlink(c) {
      if (!F.isLink(c.mode)) throw new F.ErrnoError(28);
      return c.link;
    } }, stream_ops: { read(c, d, b, v, C) {
      var T = c.node.contents;
      if (C >= c.node.usedBytes) return 0;
      var U = Math.min(c.node.usedBytes - C, v);
      if (E(U >= 0), U > 8 && T.subarray) d.set(T.subarray(C, C + U), b);
      else for (var X = 0; X < U; X++) d[b + X] = T[C + X];
      return U;
    }, write(c, d, b, v, C, T) {
      if (E(!(d instanceof ArrayBuffer)), d.buffer === B.buffer && (T = false), !v) return 0;
      var U = c.node;
      if (U.timestamp = Date.now(), d.subarray && (!U.contents || U.contents.subarray)) {
        if (T) return E(C === 0, "canOwn must imply no weird position inside the file"), U.contents = d.subarray(b, b + v), U.usedBytes = v, v;
        if (U.usedBytes === 0 && C === 0) return U.contents = d.slice(b, b + v), U.usedBytes = v, v;
        if (C + v <= U.usedBytes) return U.contents.set(d.subarray(b, b + v), C), v;
      }
      if (Ae.expandFileStorage(U, C + v), U.contents.subarray && d.subarray) U.contents.set(d.subarray(b, b + v), C);
      else for (var X = 0; X < v; X++) U.contents[C + X] = d[b + X];
      return U.usedBytes = Math.max(U.usedBytes, C + v), v;
    }, llseek(c, d, b) {
      var v = d;
      if (b === 1 ? v += c.position : b === 2 && F.isFile(c.node.mode) && (v += c.node.usedBytes), v < 0) throw new F.ErrnoError(28);
      return v;
    }, allocate(c, d, b) {
      Ae.expandFileStorage(c.node, d + b), c.node.usedBytes = Math.max(c.node.usedBytes, d + b);
    }, mmap(c, d, b, v, C) {
      if (!F.isFile(c.node.mode)) throw new F.ErrnoError(43);
      var T, U, X = c.node.contents;
      if (!(C & 2) && X && X.buffer === B.buffer) U = false, T = X.byteOffset;
      else {
        if (U = true, T = Lt(d), !T) throw new F.ErrnoError(48);
        X && ((b > 0 || b + d < X.length) && (X.subarray ? X = X.subarray(b, b + d) : X = Array.prototype.slice.call(X, b, b + d)), B.set(X, T));
      }
      return { ptr: T, allocated: U };
    }, msync(c, d, b, v, C) {
      return Ae.stream_ops.write(c, d, 0, v, b, false), 0;
    } } }, kn = (c, d, b, v) => {
      var C = dt(`al ${c}`);
      P(c).then((T) => {
        E(T, `Loading data file "${c}" failed (no arrayBuffer).`), d(new Uint8Array(T)), C && It(C);
      }, (T) => {
        if (b) b();
        else throw `Loading data file "${c}" failed.`;
      }), C && Rt(C);
    }, Wt = (c, d, b, v, C, T) => {
      F.createDataFile(c, d, b, v, C, T);
    }, hr = e.preloadPlugins || [], g = (c, d, b, v) => {
      typeof Browser < "u" && Browser.init();
      var C = false;
      return hr.forEach((T) => {
        C || T.canHandle(d) && (T.handle(c, d, b, v), C = true);
      }), C;
    }, S = (c, d, b, v, C, T, U, X, le, Pe) => {
      var xe = d ? He.resolve(Be.join2(c, d)) : c, Se = dt(`cp ${xe}`);
      function ke(Fe) {
        function De(We) {
          Pe?.(), X || Wt(c, d, We, v, C, le), T?.(), It(Se);
        }
        g(Fe, xe, De, () => {
          U?.(), It(Se);
        }) || De(Fe);
      }
      Rt(Se), typeof b == "string" ? kn(b, ke, U) : ke(b);
    }, I = (c) => {
      var d = { r: 0, "r+": 2, w: 577, "w+": 578, a: 1089, "a+": 1090 }, b = d[c];
      if (typeof b > "u") throw new Error(`Unknown file open mode: ${c}`);
      return b;
    }, R = (c, d) => {
      var b = 0;
      return c && (b |= 365), d && (b |= 146), b;
    }, L = (c) => xt(Pi(c)), j = { EPERM: 63, ENOENT: 44, ESRCH: 71, EINTR: 27, EIO: 29, ENXIO: 60, E2BIG: 1, ENOEXEC: 45, EBADF: 8, ECHILD: 12, EAGAIN: 6, EWOULDBLOCK: 6, ENOMEM: 48, EACCES: 2, EFAULT: 21, ENOTBLK: 105, EBUSY: 10, EEXIST: 20, EXDEV: 75, ENODEV: 43, ENOTDIR: 54, EISDIR: 31, EINVAL: 28, ENFILE: 41, EMFILE: 33, ENOTTY: 59, ETXTBSY: 74, EFBIG: 22, ENOSPC: 51, ESPIPE: 70, EROFS: 69, EMLINK: 34, EPIPE: 64, EDOM: 18, ERANGE: 68, ENOMSG: 49, EIDRM: 24, ECHRNG: 106, EL2NSYNC: 156, EL3HLT: 107, EL3RST: 108, ELNRNG: 109, EUNATCH: 110, ENOCSI: 111, EL2HLT: 112, EDEADLK: 16, ENOLCK: 46, EBADE: 113, EBADR: 114, EXFULL: 115, ENOANO: 104, EBADRQC: 103, EBADSLT: 102, EDEADLOCK: 16, EBFONT: 101, ENOSTR: 100, ENODATA: 116, ETIME: 117, ENOSR: 118, ENONET: 119, ENOPKG: 120, EREMOTE: 121, ENOLINK: 47, EADV: 122, ESRMNT: 123, ECOMM: 124, EPROTO: 65, EMULTIHOP: 36, EDOTDOT: 125, EBADMSG: 9, ENOTUNIQ: 126, EBADFD: 127, EREMCHG: 128, ELIBACC: 129, ELIBBAD: 130, ELIBSCN: 131, ELIBMAX: 132, ELIBEXEC: 133, ENOSYS: 52, ENOTEMPTY: 55, ENAMETOOLONG: 37, ELOOP: 32, EOPNOTSUPP: 138, EPFNOSUPPORT: 139, ECONNRESET: 15, ENOBUFS: 42, EAFNOSUPPORT: 5, EPROTOTYPE: 67, ENOTSOCK: 57, ENOPROTOOPT: 50, ESHUTDOWN: 140, ECONNREFUSED: 14, EADDRINUSE: 3, ECONNABORTED: 13, ENETUNREACH: 40, ENETDOWN: 38, ETIMEDOUT: 73, EHOSTDOWN: 142, EHOSTUNREACH: 23, EINPROGRESS: 26, EALREADY: 7, EDESTADDRREQ: 17, EMSGSIZE: 35, EPROTONOSUPPORT: 66, ESOCKTNOSUPPORT: 137, EADDRNOTAVAIL: 4, ENETRESET: 39, EISCONN: 30, ENOTCONN: 53, ETOOMANYREFS: 141, EUSERS: 136, EDQUOT: 19, ESTALE: 72, ENOTSUP: 138, ENOMEDIUM: 148, EILSEQ: 25, EOVERFLOW: 61, ECANCELED: 11, ENOTRECOVERABLE: 56, EOWNERDEAD: 62, ESTRPIPE: 135 }, F = { root: null, mounts: [], devices: {}, streams: [], nextInode: 1, nameTable: null, currentPath: "/", initialized: false, ignorePermissions: true, ErrnoError: class extends Error {
      constructor(c) {
        super(fe ? L(c) : ""), this.name = "ErrnoError", this.errno = c;
        for (var d in j) if (j[d] === c) {
          this.code = d;
          break;
        }
      }
    }, genericErrors: {}, filesystems: null, syncFSRequests: 0, readFiles: {}, FSStream: class {
      constructor() {
        this.shared = {};
      }
      get object() {
        return this.node;
      }
      set object(c) {
        this.node = c;
      }
      get isRead() {
        return (this.flags & 2097155) !== 1;
      }
      get isWrite() {
        return (this.flags & 2097155) !== 0;
      }
      get isAppend() {
        return this.flags & 1024;
      }
      get flags() {
        return this.shared.flags;
      }
      set flags(c) {
        this.shared.flags = c;
      }
      get position() {
        return this.shared.position;
      }
      set position(c) {
        this.shared.position = c;
      }
    }, FSNode: class {
      constructor(c, d, b, v) {
        c || (c = this), this.parent = c, this.mount = c.mount, this.mounted = null, this.id = F.nextInode++, this.name = d, this.mode = b, this.node_ops = {}, this.stream_ops = {}, this.rdev = v, this.readMode = 365, this.writeMode = 146;
      }
      get read() {
        return (this.mode & this.readMode) === this.readMode;
      }
      set read(c) {
        c ? this.mode |= this.readMode : this.mode &= ~this.readMode;
      }
      get write() {
        return (this.mode & this.writeMode) === this.writeMode;
      }
      set write(c) {
        c ? this.mode |= this.writeMode : this.mode &= ~this.writeMode;
      }
      get isFolder() {
        return F.isDir(this.mode);
      }
      get isDevice() {
        return F.isChrdev(this.mode);
      }
    }, lookupPath(c, d = {}) {
      if (c = He.resolve(c), !c) return { path: "", node: null };
      var b = { follow_mount: true, recurse_count: 0 };
      if (d = Object.assign(b, d), d.recurse_count > 8) throw new F.ErrnoError(32);
      for (var v = c.split("/").filter((Se) => !!Se), C = F.root, T = "/", U = 0; U < v.length; U++) {
        var X = U === v.length - 1;
        if (X && d.parent) break;
        if (C = F.lookupNode(C, v[U]), T = Be.join2(T, v[U]), F.isMountpoint(C) && (!X || X && d.follow_mount) && (C = C.mounted.root), !X || d.follow) for (var le = 0; F.isLink(C.mode); ) {
          var Pe = F.readlink(T);
          T = He.resolve(Be.dirname(T), Pe);
          var xe = F.lookupPath(T, { recurse_count: d.recurse_count + 1 });
          if (C = xe.node, le++ > 40) throw new F.ErrnoError(32);
        }
      }
      return { path: T, node: C };
    }, getPath(c) {
      for (var d; ; ) {
        if (F.isRoot(c)) {
          var b = c.mount.mountpoint;
          return d ? b[b.length - 1] !== "/" ? `${b}/${d}` : b + d : b;
        }
        d = d ? `${c.name}/${d}` : c.name, c = c.parent;
      }
    }, hashName(c, d) {
      for (var b = 0, v = 0; v < d.length; v++) b = (b << 5) - b + d.charCodeAt(v) | 0;
      return (c + b >>> 0) % F.nameTable.length;
    }, hashAddNode(c) {
      var d = F.hashName(c.parent.id, c.name);
      c.name_next = F.nameTable[d], F.nameTable[d] = c;
    }, hashRemoveNode(c) {
      var d = F.hashName(c.parent.id, c.name);
      if (F.nameTable[d] === c) F.nameTable[d] = c.name_next;
      else for (var b = F.nameTable[d]; b; ) {
        if (b.name_next === c) {
          b.name_next = c.name_next;
          break;
        }
        b = b.name_next;
      }
    }, lookupNode(c, d) {
      var b = F.mayLookup(c);
      if (b) throw new F.ErrnoError(b);
      for (var v = F.hashName(c.id, d), C = F.nameTable[v]; C; C = C.name_next) {
        var T = C.name;
        if (C.parent.id === c.id && T === d) return C;
      }
      return F.lookup(c, d);
    }, createNode(c, d, b, v) {
      E(typeof c == "object");
      var C = new F.FSNode(c, d, b, v);
      return F.hashAddNode(C), C;
    }, destroyNode(c) {
      F.hashRemoveNode(c);
    }, isRoot(c) {
      return c === c.parent;
    }, isMountpoint(c) {
      return !!c.mounted;
    }, isFile(c) {
      return (c & 61440) === 32768;
    }, isDir(c) {
      return (c & 61440) === 16384;
    }, isLink(c) {
      return (c & 61440) === 40960;
    }, isChrdev(c) {
      return (c & 61440) === 8192;
    }, isBlkdev(c) {
      return (c & 61440) === 24576;
    }, isFIFO(c) {
      return (c & 61440) === 4096;
    }, isSocket(c) {
      return (c & 49152) === 49152;
    }, flagsToPermissionString(c) {
      var d = ["r", "w", "rw"][c & 3];
      return c & 512 && (d += "w"), d;
    }, nodePermissions(c, d) {
      return F.ignorePermissions ? 0 : d.includes("r") && !(c.mode & 292) || d.includes("w") && !(c.mode & 146) || d.includes("x") && !(c.mode & 73) ? 2 : 0;
    }, mayLookup(c) {
      if (!F.isDir(c.mode)) return 54;
      var d = F.nodePermissions(c, "x");
      return d || (c.node_ops.lookup ? 0 : 2);
    }, mayCreate(c, d) {
      try {
        var b = F.lookupNode(c, d);
        return 20;
      } catch {
      }
      return F.nodePermissions(c, "wx");
    }, mayDelete(c, d, b) {
      var v;
      try {
        v = F.lookupNode(c, d);
      } catch (T) {
        return T.errno;
      }
      var C = F.nodePermissions(c, "wx");
      if (C) return C;
      if (b) {
        if (!F.isDir(v.mode)) return 54;
        if (F.isRoot(v) || F.getPath(v) === F.cwd()) return 10;
      } else if (F.isDir(v.mode)) return 31;
      return 0;
    }, mayOpen(c, d) {
      return c ? F.isLink(c.mode) ? 32 : F.isDir(c.mode) && (F.flagsToPermissionString(d) !== "r" || d & 512) ? 31 : F.nodePermissions(c, F.flagsToPermissionString(d)) : 44;
    }, MAX_OPEN_FDS: 4096, nextfd() {
      for (var c = 0; c <= F.MAX_OPEN_FDS; c++) if (!F.streams[c]) return c;
      throw new F.ErrnoError(33);
    }, getStreamChecked(c) {
      var d = F.getStream(c);
      if (!d) throw new F.ErrnoError(8);
      return d;
    }, getStream: (c) => F.streams[c], createStream(c, d = -1) {
      return E(d >= -1), c = Object.assign(new F.FSStream(), c), d == -1 && (d = F.nextfd()), c.fd = d, F.streams[d] = c, c;
    }, closeStream(c) {
      F.streams[c] = null;
    }, dupStream(c, d = -1) {
      var b = F.createStream(c, d);
      return b.stream_ops?.dup?.(b), b;
    }, chrdev_stream_ops: { open(c) {
      var d = F.getDevice(c.node.rdev);
      c.stream_ops = d.stream_ops, c.stream_ops.open?.(c);
    }, llseek() {
      throw new F.ErrnoError(70);
    } }, major: (c) => c >> 8, minor: (c) => c & 255, makedev: (c, d) => c << 8 | d, registerDevice(c, d) {
      F.devices[c] = { stream_ops: d };
    }, getDevice: (c) => F.devices[c], getMounts(c) {
      for (var d = [], b = [c]; b.length; ) {
        var v = b.pop();
        d.push(v), b.push(...v.mounts);
      }
      return d;
    }, syncfs(c, d) {
      typeof c == "function" && (d = c, c = false), F.syncFSRequests++, F.syncFSRequests > 1 && A(`warning: ${F.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
      var b = F.getMounts(F.root.mount), v = 0;
      function C(U) {
        return E(F.syncFSRequests > 0), F.syncFSRequests--, d(U);
      }
      function T(U) {
        if (U) return T.errored ? void 0 : (T.errored = true, C(U));
        ++v >= b.length && C(null);
      }
      b.forEach((U) => {
        if (!U.type.syncfs) return T(null);
        U.type.syncfs(U, c, T);
      });
    }, mount(c, d, b) {
      if (typeof c == "string") throw c;
      var v = b === "/", C = !b, T;
      if (v && F.root) throw new F.ErrnoError(10);
      if (!v && !C) {
        var U = F.lookupPath(b, { follow_mount: false });
        if (b = U.path, T = U.node, F.isMountpoint(T)) throw new F.ErrnoError(10);
        if (!F.isDir(T.mode)) throw new F.ErrnoError(54);
      }
      var X = { type: c, opts: d, mountpoint: b, mounts: [] }, le = c.mount(X);
      return le.mount = X, X.root = le, v ? F.root = le : T && (T.mounted = X, T.mount && T.mount.mounts.push(X)), le;
    }, unmount(c) {
      var d = F.lookupPath(c, { follow_mount: false });
      if (!F.isMountpoint(d.node)) throw new F.ErrnoError(28);
      var b = d.node, v = b.mounted, C = F.getMounts(v);
      Object.keys(F.nameTable).forEach((U) => {
        for (var X = F.nameTable[U]; X; ) {
          var le = X.name_next;
          C.includes(X.mount) && F.destroyNode(X), X = le;
        }
      }), b.mounted = null;
      var T = b.mount.mounts.indexOf(v);
      E(T !== -1), b.mount.mounts.splice(T, 1);
    }, lookup(c, d) {
      return c.node_ops.lookup(c, d);
    }, mknod(c, d, b) {
      var v = F.lookupPath(c, { parent: true }), C = v.node, T = Be.basename(c);
      if (!T || T === "." || T === "..") throw new F.ErrnoError(28);
      var U = F.mayCreate(C, T);
      if (U) throw new F.ErrnoError(U);
      if (!C.node_ops.mknod) throw new F.ErrnoError(63);
      return C.node_ops.mknod(C, T, d, b);
    }, create(c, d) {
      return d = d !== void 0 ? d : 438, d &= 4095, d |= 32768, F.mknod(c, d, 0);
    }, mkdir(c, d) {
      return d = d !== void 0 ? d : 511, d &= 1023, d |= 16384, F.mknod(c, d, 0);
    }, mkdirTree(c, d) {
      for (var b = c.split("/"), v = "", C = 0; C < b.length; ++C) if (b[C]) {
        v += "/" + b[C];
        try {
          F.mkdir(v, d);
        } catch (T) {
          if (T.errno != 20) throw T;
        }
      }
    }, mkdev(c, d, b) {
      return typeof b > "u" && (b = d, d = 438), d |= 8192, F.mknod(c, d, b);
    }, symlink(c, d) {
      if (!He.resolve(c)) throw new F.ErrnoError(44);
      var b = F.lookupPath(d, { parent: true }), v = b.node;
      if (!v) throw new F.ErrnoError(44);
      var C = Be.basename(d), T = F.mayCreate(v, C);
      if (T) throw new F.ErrnoError(T);
      if (!v.node_ops.symlink) throw new F.ErrnoError(63);
      return v.node_ops.symlink(v, C, c);
    }, rename(c, d) {
      var b = Be.dirname(c), v = Be.dirname(d), C = Be.basename(c), T = Be.basename(d), U, X, le;
      if (U = F.lookupPath(c, { parent: true }), X = U.node, U = F.lookupPath(d, { parent: true }), le = U.node, !X || !le) throw new F.ErrnoError(44);
      if (X.mount !== le.mount) throw new F.ErrnoError(75);
      var Pe = F.lookupNode(X, C), xe = He.relative(c, v);
      if (xe.charAt(0) !== ".") throw new F.ErrnoError(28);
      if (xe = He.relative(d, b), xe.charAt(0) !== ".") throw new F.ErrnoError(55);
      var Se;
      try {
        Se = F.lookupNode(le, T);
      } catch {
      }
      if (Pe !== Se) {
        var ke = F.isDir(Pe.mode), Fe = F.mayDelete(X, C, ke);
        if (Fe) throw new F.ErrnoError(Fe);
        if (Fe = Se ? F.mayDelete(le, T, ke) : F.mayCreate(le, T), Fe) throw new F.ErrnoError(Fe);
        if (!X.node_ops.rename) throw new F.ErrnoError(63);
        if (F.isMountpoint(Pe) || Se && F.isMountpoint(Se)) throw new F.ErrnoError(10);
        if (le !== X && (Fe = F.nodePermissions(X, "w"), Fe)) throw new F.ErrnoError(Fe);
        F.hashRemoveNode(Pe);
        try {
          X.node_ops.rename(Pe, le, T), Pe.parent = le;
        } catch (De) {
          throw De;
        } finally {
          F.hashAddNode(Pe);
        }
      }
    }, rmdir(c) {
      var d = F.lookupPath(c, { parent: true }), b = d.node, v = Be.basename(c), C = F.lookupNode(b, v), T = F.mayDelete(b, v, true);
      if (T) throw new F.ErrnoError(T);
      if (!b.node_ops.rmdir) throw new F.ErrnoError(63);
      if (F.isMountpoint(C)) throw new F.ErrnoError(10);
      b.node_ops.rmdir(b, v), F.destroyNode(C);
    }, readdir(c) {
      var d = F.lookupPath(c, { follow: true }), b = d.node;
      if (!b.node_ops.readdir) throw new F.ErrnoError(54);
      return b.node_ops.readdir(b);
    }, unlink(c) {
      var d = F.lookupPath(c, { parent: true }), b = d.node;
      if (!b) throw new F.ErrnoError(44);
      var v = Be.basename(c), C = F.lookupNode(b, v), T = F.mayDelete(b, v, false);
      if (T) throw new F.ErrnoError(T);
      if (!b.node_ops.unlink) throw new F.ErrnoError(63);
      if (F.isMountpoint(C)) throw new F.ErrnoError(10);
      b.node_ops.unlink(b, v), F.destroyNode(C);
    }, readlink(c) {
      var d = F.lookupPath(c), b = d.node;
      if (!b) throw new F.ErrnoError(44);
      if (!b.node_ops.readlink) throw new F.ErrnoError(28);
      return He.resolve(F.getPath(b.parent), b.node_ops.readlink(b));
    }, stat(c, d) {
      var b = F.lookupPath(c, { follow: !d }), v = b.node;
      if (!v) throw new F.ErrnoError(44);
      if (!v.node_ops.getattr) throw new F.ErrnoError(63);
      return v.node_ops.getattr(v);
    }, lstat(c) {
      return F.stat(c, true);
    }, chmod(c, d, b) {
      var v;
      if (typeof c == "string") {
        var C = F.lookupPath(c, { follow: !b });
        v = C.node;
      } else v = c;
      if (!v.node_ops.setattr) throw new F.ErrnoError(63);
      v.node_ops.setattr(v, { mode: d & 4095 | v.mode & -4096, timestamp: Date.now() });
    }, lchmod(c, d) {
      F.chmod(c, d, true);
    }, fchmod(c, d) {
      var b = F.getStreamChecked(c);
      F.chmod(b.node, d);
    }, chown(c, d, b, v) {
      var C;
      if (typeof c == "string") {
        var T = F.lookupPath(c, { follow: !v });
        C = T.node;
      } else C = c;
      if (!C.node_ops.setattr) throw new F.ErrnoError(63);
      C.node_ops.setattr(C, { timestamp: Date.now() });
    }, lchown(c, d, b) {
      F.chown(c, d, b, true);
    }, fchown(c, d, b) {
      var v = F.getStreamChecked(c);
      F.chown(v.node);
    }, truncate(c, d) {
      if (d < 0) throw new F.ErrnoError(28);
      var b;
      if (typeof c == "string") {
        var v = F.lookupPath(c, { follow: true });
        b = v.node;
      } else b = c;
      if (!b.node_ops.setattr) throw new F.ErrnoError(63);
      if (F.isDir(b.mode)) throw new F.ErrnoError(31);
      if (!F.isFile(b.mode)) throw new F.ErrnoError(28);
      var C = F.nodePermissions(b, "w");
      if (C) throw new F.ErrnoError(C);
      b.node_ops.setattr(b, { size: d, timestamp: Date.now() });
    }, ftruncate(c, d) {
      var b = F.getStreamChecked(c);
      if ((b.flags & 2097155) === 0) throw new F.ErrnoError(28);
      F.truncate(b.node, d);
    }, utime(c, d, b) {
      var v = F.lookupPath(c, { follow: true }), C = v.node;
      C.node_ops.setattr(C, { timestamp: Math.max(d, b) });
    }, open(c, d, b) {
      if (c === "") throw new F.ErrnoError(44);
      d = typeof d == "string" ? I(d) : d, d & 64 ? (b = typeof b > "u" ? 438 : b, b = b & 4095 | 32768) : b = 0;
      var v;
      if (typeof c == "object") v = c;
      else {
        c = Be.normalize(c);
        try {
          var C = F.lookupPath(c, { follow: !(d & 131072) });
          v = C.node;
        } catch {
        }
      }
      var T = false;
      if (d & 64) if (v) {
        if (d & 128) throw new F.ErrnoError(20);
      } else v = F.mknod(c, b, 0), T = true;
      if (!v) throw new F.ErrnoError(44);
      if (F.isChrdev(v.mode) && (d &= -513), d & 65536 && !F.isDir(v.mode)) throw new F.ErrnoError(54);
      if (!T) {
        var U = F.mayOpen(v, d);
        if (U) throw new F.ErrnoError(U);
      }
      d & 512 && !T && F.truncate(v, 0), d &= -131713;
      var X = F.createStream({ node: v, path: F.getPath(v), flags: d, seekable: true, position: 0, stream_ops: v.stream_ops, ungotten: [], error: false });
      return X.stream_ops.open && X.stream_ops.open(X), e.logReadFiles && !(d & 1) && (c in F.readFiles || (F.readFiles[c] = 1)), X;
    }, close(c) {
      if (F.isClosed(c)) throw new F.ErrnoError(8);
      c.getdents && (c.getdents = null);
      try {
        c.stream_ops.close && c.stream_ops.close(c);
      } catch (d) {
        throw d;
      } finally {
        F.closeStream(c.fd);
      }
      c.fd = null;
    }, isClosed(c) {
      return c.fd === null;
    }, llseek(c, d, b) {
      if (F.isClosed(c)) throw new F.ErrnoError(8);
      if (!c.seekable || !c.stream_ops.llseek) throw new F.ErrnoError(70);
      if (b != 0 && b != 1 && b != 2) throw new F.ErrnoError(28);
      return c.position = c.stream_ops.llseek(c, d, b), c.ungotten = [], c.position;
    }, read(c, d, b, v, C) {
      if (E(b >= 0), v < 0 || C < 0) throw new F.ErrnoError(28);
      if (F.isClosed(c)) throw new F.ErrnoError(8);
      if ((c.flags & 2097155) === 1) throw new F.ErrnoError(8);
      if (F.isDir(c.node.mode)) throw new F.ErrnoError(31);
      if (!c.stream_ops.read) throw new F.ErrnoError(28);
      var T = typeof C < "u";
      if (!T) C = c.position;
      else if (!c.seekable) throw new F.ErrnoError(70);
      var U = c.stream_ops.read(c, d, b, v, C);
      return T || (c.position += U), U;
    }, write(c, d, b, v, C, T) {
      if (E(b >= 0), v < 0 || C < 0) throw new F.ErrnoError(28);
      if (F.isClosed(c)) throw new F.ErrnoError(8);
      if ((c.flags & 2097155) === 0) throw new F.ErrnoError(8);
      if (F.isDir(c.node.mode)) throw new F.ErrnoError(31);
      if (!c.stream_ops.write) throw new F.ErrnoError(28);
      c.seekable && c.flags & 1024 && F.llseek(c, 0, 2);
      var U = typeof C < "u";
      if (!U) C = c.position;
      else if (!c.seekable) throw new F.ErrnoError(70);
      var X = c.stream_ops.write(c, d, b, v, C, T);
      return U || (c.position += X), X;
    }, allocate(c, d, b) {
      if (F.isClosed(c)) throw new F.ErrnoError(8);
      if (d < 0 || b <= 0) throw new F.ErrnoError(28);
      if ((c.flags & 2097155) === 0) throw new F.ErrnoError(8);
      if (!F.isFile(c.node.mode) && !F.isDir(c.node.mode)) throw new F.ErrnoError(43);
      if (!c.stream_ops.allocate) throw new F.ErrnoError(138);
      c.stream_ops.allocate(c, d, b);
    }, mmap(c, d, b, v, C) {
      if ((v & 2) !== 0 && (C & 2) === 0 && (c.flags & 2097155) !== 2) throw new F.ErrnoError(2);
      if ((c.flags & 2097155) === 1) throw new F.ErrnoError(2);
      if (!c.stream_ops.mmap) throw new F.ErrnoError(43);
      if (!d) throw new F.ErrnoError(28);
      return c.stream_ops.mmap(c, d, b, v, C);
    }, msync(c, d, b, v, C) {
      return E(b >= 0), c.stream_ops.msync ? c.stream_ops.msync(c, d, b, v, C) : 0;
    }, ioctl(c, d, b) {
      if (!c.stream_ops.ioctl) throw new F.ErrnoError(59);
      return c.stream_ops.ioctl(c, d, b);
    }, readFile(c, d = {}) {
      if (d.flags = d.flags || 0, d.encoding = d.encoding || "binary", d.encoding !== "utf8" && d.encoding !== "binary") throw new Error(`Invalid encoding type "${d.encoding}"`);
      var b, v = F.open(c, d.flags), C = F.stat(c), T = C.size, U = new Uint8Array(T);
      return F.read(v, U, 0, T, 0), d.encoding === "utf8" ? b = vt(U) : d.encoding === "binary" && (b = U), F.close(v), b;
    }, writeFile(c, d, b = {}) {
      b.flags = b.flags || 577;
      var v = F.open(c, b.flags, b.mode);
      if (typeof d == "string") {
        var C = new Uint8Array(Ht(d) + 1), T = M(d, C, 0, C.length);
        F.write(v, C, 0, T, void 0, b.canOwn);
      } else if (ArrayBuffer.isView(d)) F.write(v, d, 0, d.byteLength, void 0, b.canOwn);
      else throw new Error("Unsupported data type");
      F.close(v);
    }, cwd: () => F.currentPath, chdir(c) {
      var d = F.lookupPath(c, { follow: true });
      if (d.node === null) throw new F.ErrnoError(44);
      if (!F.isDir(d.node.mode)) throw new F.ErrnoError(54);
      var b = F.nodePermissions(d.node, "x");
      if (b) throw new F.ErrnoError(b);
      F.currentPath = d.path;
    }, createDefaultDirectories() {
      F.mkdir("/tmp"), F.mkdir("/home"), F.mkdir("/home/web_user");
    }, createDefaultDevices() {
      F.mkdir("/dev"), F.registerDevice(F.makedev(1, 3), { read: () => 0, write: (v, C, T, U, X) => U }), F.mkdev("/dev/null", F.makedev(1, 3)), Re.register(F.makedev(5, 0), Re.default_tty_ops), Re.register(F.makedev(6, 0), Re.default_tty1_ops), F.mkdev("/dev/tty", F.makedev(5, 0)), F.mkdev("/dev/tty1", F.makedev(6, 0));
      var c = new Uint8Array(1024), d = 0, b = () => (d === 0 && (d = dn(c).byteLength), c[--d]);
      F.createDevice("/dev", "random", b), F.createDevice("/dev", "urandom", b), F.mkdir("/dev/shm"), F.mkdir("/dev/shm/tmp");
    }, createSpecialDirectories() {
      F.mkdir("/proc");
      var c = F.mkdir("/proc/self");
      F.mkdir("/proc/self/fd"), F.mount({ mount() {
        var d = F.createNode(c, "fd", 16895, 73);
        return d.node_ops = { lookup(b, v) {
          var C = +v, T = F.getStreamChecked(C), U = { parent: null, mount: { mountpoint: "fake" }, node_ops: { readlink: () => T.path } };
          return U.parent = U, U;
        } }, d;
      } }, {}, "/proc/self/fd");
    }, createStandardStreams(c, d, b) {
      c ? F.createDevice("/dev", "stdin", c) : F.symlink("/dev/tty", "/dev/stdin"), d ? F.createDevice("/dev", "stdout", null, d) : F.symlink("/dev/tty", "/dev/stdout"), b ? F.createDevice("/dev", "stderr", null, b) : F.symlink("/dev/tty1", "/dev/stderr");
      var v = F.open("/dev/stdin", 0), C = F.open("/dev/stdout", 1), T = F.open("/dev/stderr", 1);
      E(v.fd === 0, `invalid handle for stdin (${v.fd})`), E(C.fd === 1, `invalid handle for stdout (${C.fd})`), E(T.fd === 2, `invalid handle for stderr (${T.fd})`);
    }, staticInit() {
      [44].forEach((c) => {
        F.genericErrors[c] = new F.ErrnoError(c), F.genericErrors[c].stack = "<generic error, no stack>";
      }), F.nameTable = new Array(4096), F.mount(Ae, {}, "/"), F.createDefaultDirectories(), F.createDefaultDevices(), F.createSpecialDirectories(), F.filesystems = { MEMFS: Ae };
    }, init(c, d, b) {
      E(!F.initialized, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)"), F.initialized = true, c ??= e.stdin, d ??= e.stdout, b ??= e.stderr, F.createStandardStreams(c, d, b);
    }, quit() {
      F.initialized = false, Di(0);
      for (var c = 0; c < F.streams.length; c++) {
        var d = F.streams[c];
        d && F.close(d);
      }
    }, findObject(c, d) {
      var b = F.analyzePath(c, d);
      return b.exists ? b.object : null;
    }, analyzePath(c, d) {
      try {
        var b = F.lookupPath(c, { follow: !d });
        c = b.path;
      } catch {
      }
      var v = { isRoot: false, exists: false, error: 0, name: null, path: null, object: null, parentExists: false, parentPath: null, parentObject: null };
      try {
        var b = F.lookupPath(c, { parent: true });
        v.parentExists = true, v.parentPath = b.path, v.parentObject = b.node, v.name = Be.basename(c), b = F.lookupPath(c, { follow: !d }), v.exists = true, v.path = b.path, v.object = b.node, v.name = b.node.name, v.isRoot = b.path === "/";
      } catch (C) {
        v.error = C.errno;
      }
      return v;
    }, createPath(c, d, b, v) {
      c = typeof c == "string" ? c : F.getPath(c);
      for (var C = d.split("/").reverse(); C.length; ) {
        var T = C.pop();
        if (T) {
          var U = Be.join2(c, T);
          try {
            F.mkdir(U);
          } catch {
          }
          c = U;
        }
      }
      return U;
    }, createFile(c, d, b, v, C) {
      var T = Be.join2(typeof c == "string" ? c : F.getPath(c), d), U = R(v, C);
      return F.create(T, U);
    }, createDataFile(c, d, b, v, C, T) {
      var U = d;
      c && (c = typeof c == "string" ? c : F.getPath(c), U = d ? Be.join2(c, d) : c);
      var X = R(v, C), le = F.create(U, X);
      if (b) {
        if (typeof b == "string") {
          for (var Pe = new Array(b.length), xe = 0, Se = b.length; xe < Se; ++xe) Pe[xe] = b.charCodeAt(xe);
          b = Pe;
        }
        F.chmod(le, X | 146);
        var ke = F.open(le, 577);
        F.write(ke, b, 0, b.length, 0, T), F.close(ke), F.chmod(le, X);
      }
    }, createDevice(c, d, b, v) {
      var C = Be.join2(typeof c == "string" ? c : F.getPath(c), d), T = R(!!b, !!v);
      F.createDevice.major ??= 64;
      var U = F.makedev(F.createDevice.major++, 0);
      return F.registerDevice(U, { open(X) {
        X.seekable = false;
      }, close(X) {
        v?.buffer?.length && v(10);
      }, read(X, le, Pe, xe, Se) {
        for (var ke = 0, Fe = 0; Fe < xe; Fe++) {
          var De;
          try {
            De = b();
          } catch {
            throw new F.ErrnoError(29);
          }
          if (De === void 0 && ke === 0) throw new F.ErrnoError(6);
          if (De == null) break;
          ke++, le[Pe + Fe] = De;
        }
        return ke && (X.node.timestamp = Date.now()), ke;
      }, write(X, le, Pe, xe, Se) {
        for (var ke = 0; ke < xe; ke++) try {
          v(le[Pe + ke]);
        } catch {
          throw new F.ErrnoError(29);
        }
        return xe && (X.node.timestamp = Date.now()), ke;
      } }), F.mkdev(C, T, U);
    }, forceLoadFile(c) {
      if (c.isDevice || c.isFolder || c.link || c.contents) return true;
      if (typeof XMLHttpRequest < "u") throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
      try {
        c.contents = D(c.url), c.usedBytes = c.contents.length;
      } catch {
        throw new F.ErrnoError(29);
      }
    }, createLazyFile(c, d, b, v, C) {
      class T {
        constructor() {
          this.lengthKnown = false, this.chunks = [];
        }
        get(Fe) {
          if (!(Fe > this.length - 1 || Fe < 0)) {
            var De = Fe % this.chunkSize, We = Fe / this.chunkSize | 0;
            return this.getter(We)[De];
          }
        }
        setDataGetter(Fe) {
          this.getter = Fe;
        }
        cacheLength() {
          var Fe = new XMLHttpRequest();
          if (Fe.open("HEAD", b, false), Fe.send(null), !(Fe.status >= 200 && Fe.status < 300 || Fe.status === 304)) throw new Error("Couldn't load " + b + ". Status: " + Fe.status);
          var De = Number(Fe.getResponseHeader("Content-length")), We, Tt = (We = Fe.getResponseHeader("Accept-Ranges")) && We === "bytes", Dt = (We = Fe.getResponseHeader("Content-Encoding")) && We === "gzip", Et = 1024 * 1024;
          Tt || (Et = De);
          var Ot = (Bt, Sn) => {
            if (Bt > Sn) throw new Error("invalid range (" + Bt + ", " + Sn + ") or no bytes requested!");
            if (Sn > De - 1) throw new Error("only " + De + " bytes available! programmer error!");
            var it = new XMLHttpRequest();
            if (it.open("GET", b, false), De !== Et && it.setRequestHeader("Range", "bytes=" + Bt + "-" + Sn), it.responseType = "arraybuffer", it.overrideMimeType && it.overrideMimeType("text/plain; charset=x-user-defined"), it.send(null), !(it.status >= 200 && it.status < 300 || it.status === 304)) throw new Error("Couldn't load " + b + ". Status: " + it.status);
            return it.response !== void 0 ? new Uint8Array(it.response || []) : he(it.responseText || "");
          }, Un = this;
          Un.setDataGetter((Bt) => {
            var Sn = Bt * Et, it = (Bt + 1) * Et - 1;
            if (it = Math.min(it, De - 1), typeof Un.chunks[Bt] > "u" && (Un.chunks[Bt] = Ot(Sn, it)), typeof Un.chunks[Bt] > "u") throw new Error("doXHR failed!");
            return Un.chunks[Bt];
          }), (Dt || !De) && (Et = De = 1, De = this.getter(0).length, Et = De, x("LazyFiles on gzip forces download of the whole file when length is accessed")), this._length = De, this._chunkSize = Et, this.lengthKnown = true;
        }
        get length() {
          return this.lengthKnown || this.cacheLength(), this._length;
        }
        get chunkSize() {
          return this.lengthKnown || this.cacheLength(), this._chunkSize;
        }
      }
      if (typeof XMLHttpRequest < "u") {
        if (!i) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
        var U = new T(), X = { isDevice: false, contents: U };
      } else var X = { isDevice: false, url: b };
      var le = F.createFile(c, d, X, v, C);
      X.contents ? le.contents = X.contents : X.url && (le.contents = null, le.url = X.url), Object.defineProperties(le, { usedBytes: { get: function() {
        return this.contents.length;
      } } });
      var Pe = {}, xe = Object.keys(le.stream_ops);
      xe.forEach((ke) => {
        var Fe = le.stream_ops[ke];
        Pe[ke] = (...De) => (F.forceLoadFile(le), Fe(...De));
      });
      function Se(ke, Fe, De, We, Tt) {
        var Dt = ke.node.contents;
        if (Tt >= Dt.length) return 0;
        var Et = Math.min(Dt.length - Tt, We);
        if (E(Et >= 0), Dt.slice) for (var Ot = 0; Ot < Et; Ot++) Fe[De + Ot] = Dt[Tt + Ot];
        else for (var Ot = 0; Ot < Et; Ot++) Fe[De + Ot] = Dt.get(Tt + Ot);
        return Et;
      }
      return Pe.read = (ke, Fe, De, We, Tt) => (F.forceLoadFile(le), Se(ke, Fe, De, We, Tt)), Pe.mmap = (ke, Fe, De, We, Tt) => {
        F.forceLoadFile(le);
        var Dt = Lt(Fe);
        if (!Dt) throw new F.ErrnoError(48);
        return Se(ke, B, Dt, Fe, De), { ptr: Dt, allocated: true };
      }, le.stream_ops = Pe, le;
    }, absolutePath() {
      Le("FS.absolutePath has been removed; use PATH_FS.resolve instead");
    }, createFolder() {
      Le("FS.createFolder has been removed; use FS.mkdir instead");
    }, createLink() {
      Le("FS.createLink has been removed; use FS.symlink instead");
    }, joinPath() {
      Le("FS.joinPath has been removed; use PATH.join instead");
    }, mmapAlloc() {
      Le("FS.mmapAlloc has been replaced by the top level function mmapAlloc");
    }, standardizePath() {
      Le("FS.standardizePath has been removed; use PATH.normalize instead");
    } }, K = { DEFAULT_POLLMASK: 5, calculateAt(c, d, b) {
      if (Be.isAbs(d)) return d;
      var v;
      if (c === -100) v = F.cwd();
      else {
        var C = K.getStreamFromFD(c);
        v = C.path;
      }
      if (d.length == 0) {
        if (!b) throw new F.ErrnoError(44);
        return v;
      }
      return Be.join2(v, d);
    }, doStat(c, d, b) {
      var v = c(d);
      N[b >> 2] = v.dev, N[b + 4 >> 2] = v.mode, V[b + 8 >> 2] = v.nlink, N[b + 12 >> 2] = v.uid, N[b + 16 >> 2] = v.gid, N[b + 20 >> 2] = v.rdev, je = [v.size >>> 0, (be = v.size, +Math.abs(be) >= 1 ? be > 0 ? +Math.floor(be / 4294967296) >>> 0 : ~~+Math.ceil((be - +(~~be >>> 0)) / 4294967296) >>> 0 : 0)], N[b + 24 >> 2] = je[0], N[b + 28 >> 2] = je[1], N[b + 32 >> 2] = 4096, N[b + 36 >> 2] = v.blocks;
      var C = v.atime.getTime(), T = v.mtime.getTime(), U = v.ctime.getTime();
      return je = [Math.floor(C / 1e3) >>> 0, (be = Math.floor(C / 1e3), +Math.abs(be) >= 1 ? be > 0 ? +Math.floor(be / 4294967296) >>> 0 : ~~+Math.ceil((be - +(~~be >>> 0)) / 4294967296) >>> 0 : 0)], N[b + 40 >> 2] = je[0], N[b + 44 >> 2] = je[1], V[b + 48 >> 2] = C % 1e3 * 1e3 * 1e3, je = [Math.floor(T / 1e3) >>> 0, (be = Math.floor(T / 1e3), +Math.abs(be) >= 1 ? be > 0 ? +Math.floor(be / 4294967296) >>> 0 : ~~+Math.ceil((be - +(~~be >>> 0)) / 4294967296) >>> 0 : 0)], N[b + 56 >> 2] = je[0], N[b + 60 >> 2] = je[1], V[b + 64 >> 2] = T % 1e3 * 1e3 * 1e3, je = [Math.floor(U / 1e3) >>> 0, (be = Math.floor(U / 1e3), +Math.abs(be) >= 1 ? be > 0 ? +Math.floor(be / 4294967296) >>> 0 : ~~+Math.ceil((be - +(~~be >>> 0)) / 4294967296) >>> 0 : 0)], N[b + 72 >> 2] = je[0], N[b + 76 >> 2] = je[1], V[b + 80 >> 2] = U % 1e3 * 1e3 * 1e3, je = [v.ino >>> 0, (be = v.ino, +Math.abs(be) >= 1 ? be > 0 ? +Math.floor(be / 4294967296) >>> 0 : ~~+Math.ceil((be - +(~~be >>> 0)) / 4294967296) >>> 0 : 0)], N[b + 88 >> 2] = je[0], N[b + 92 >> 2] = je[1], 0;
    }, doMsync(c, d, b, v, C) {
      if (!F.isFile(d.node.mode)) throw new F.ErrnoError(43);
      if (v & 2) return 0;
      var T = z.slice(c, c + b);
      F.msync(d, T, C, b, v);
    }, getStreamFromFD(c) {
      var d = F.getStreamChecked(c);
      return d;
    }, varargs: void 0, getStr(c) {
      var d = xt(c);
      return d;
    } };
    function se(c, d, b) {
      K.varargs = b;
      try {
        var v = K.getStreamFromFD(c);
        switch (d) {
          case 0: {
            var C = Gt();
            if (C < 0) return -28;
            for (; F.streams[C]; ) C++;
            var T;
            return T = F.dupStream(v, C), T.fd;
          }
          case 1:
          case 2:
            return 0;
          case 3:
            return v.flags;
          case 4: {
            var C = Gt();
            return v.flags |= C, 0;
          }
          case 12: {
            var C = At(), U = 0;
            return O[C + U >> 1] = 2, 0;
          }
          case 13:
          case 14:
            return 0;
        }
        return -28;
      } catch (X) {
        if (typeof F > "u" || X.name !== "ErrnoError") throw X;
        return -X.errno;
      }
    }
    function te(c, d) {
      try {
        var b = K.getStreamFromFD(c);
        return K.doStat(F.stat, b.path, d);
      } catch (v) {
        if (typeof F > "u" || v.name !== "ErrnoError") throw v;
        return -v.errno;
      }
    }
    var re = (c, d) => (E(c == c >>> 0 || c == (c | 0)), E(d === (d | 0)), d + 2097152 >>> 0 < 4194305 - !!c ? (c >>> 0) + d * 4294967296 : NaN);
    function ie(c, d, b) {
      var v = re(d, b);
      try {
        return isNaN(v) ? 61 : (F.ftruncate(c, v), 0);
      } catch (C) {
        if (typeof F > "u" || C.name !== "ErrnoError") throw C;
        return -C.errno;
      }
    }
    var me = (c, d, b) => (E(typeof b == "number", "stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!"), M(c, z, d, b));
    function pe(c, d, b) {
      try {
        var v = K.getStreamFromFD(c);
        v.getdents ||= F.readdir(v.path);
        for (var C = 280, T = 0, U = F.llseek(v, 0, 1), X = Math.floor(U / C); X < v.getdents.length && T + C <= b; ) {
          var le, Pe, xe = v.getdents[X];
          if (xe === ".") le = v.node.id, Pe = 4;
          else if (xe === "..") {
            var Se = F.lookupPath(v.path, { parent: true });
            le = Se.node.id, Pe = 4;
          } else {
            var ke = F.lookupNode(v.node, xe);
            le = ke.id, Pe = F.isChrdev(ke.mode) ? 2 : F.isDir(ke.mode) ? 4 : F.isLink(ke.mode) ? 10 : 8;
          }
          E(le), je = [le >>> 0, (be = le, +Math.abs(be) >= 1 ? be > 0 ? +Math.floor(be / 4294967296) >>> 0 : ~~+Math.ceil((be - +(~~be >>> 0)) / 4294967296) >>> 0 : 0)], N[d + T >> 2] = je[0], N[d + T + 4 >> 2] = je[1], je = [(X + 1) * C >>> 0, (be = (X + 1) * C, +Math.abs(be) >= 1 ? be > 0 ? +Math.floor(be / 4294967296) >>> 0 : ~~+Math.ceil((be - +(~~be >>> 0)) / 4294967296) >>> 0 : 0)], N[d + T + 8 >> 2] = je[0], N[d + T + 12 >> 2] = je[1], O[d + T + 16 >> 1] = 280, B[d + T + 18] = Pe, me(xe, d + T + 19, 256), T += C, X += 1;
        }
        return F.llseek(v, X * C, 0), T;
      } catch (Fe) {
        if (typeof F > "u" || Fe.name !== "ErrnoError") throw Fe;
        return -Fe.errno;
      }
    }
    function Ie(c, d, b) {
      K.varargs = b;
      try {
        var v = K.getStreamFromFD(c);
        switch (d) {
          case 21509:
            return v.tty ? 0 : -59;
          case 21505: {
            if (!v.tty) return -59;
            if (v.tty.ops.ioctl_tcgets) {
              var C = v.tty.ops.ioctl_tcgets(v), T = At();
              N[T >> 2] = C.c_iflag || 0, N[T + 4 >> 2] = C.c_oflag || 0, N[T + 8 >> 2] = C.c_cflag || 0, N[T + 12 >> 2] = C.c_lflag || 0;
              for (var U = 0; U < 32; U++) B[T + U + 17] = C.c_cc[U] || 0;
              return 0;
            }
            return 0;
          }
          case 21510:
          case 21511:
          case 21512:
            return v.tty ? 0 : -59;
          case 21506:
          case 21507:
          case 21508: {
            if (!v.tty) return -59;
            if (v.tty.ops.ioctl_tcsets) {
              for (var T = At(), X = N[T >> 2], le = N[T + 4 >> 2], Pe = N[T + 8 >> 2], xe = N[T + 12 >> 2], Se = [], U = 0; U < 32; U++) Se.push(B[T + U + 17]);
              return v.tty.ops.ioctl_tcsets(v.tty, d, { c_iflag: X, c_oflag: le, c_cflag: Pe, c_lflag: xe, c_cc: Se });
            }
            return 0;
          }
          case 21519: {
            if (!v.tty) return -59;
            var T = At();
            return N[T >> 2] = 0, 0;
          }
          case 21520:
            return v.tty ? -28 : -59;
          case 21531: {
            var T = At();
            return F.ioctl(v, d, T);
          }
          case 21523: {
            if (!v.tty) return -59;
            if (v.tty.ops.ioctl_tiocgwinsz) {
              var ke = v.tty.ops.ioctl_tiocgwinsz(v.tty), T = At();
              O[T >> 1] = ke[0], O[T + 2 >> 1] = ke[1];
            }
            return 0;
          }
          case 21524:
            return v.tty ? 0 : -59;
          case 21515:
            return v.tty ? 0 : -59;
          default:
            return -28;
        }
      } catch (Fe) {
        if (typeof F > "u" || Fe.name !== "ErrnoError") throw Fe;
        return -Fe.errno;
      }
    }
    function Me(c, d) {
      try {
        return c = K.getStr(c), K.doStat(F.lstat, c, d);
      } catch (b) {
        if (typeof F > "u" || b.name !== "ErrnoError") throw b;
        return -b.errno;
      }
    }
    function Ye(c, d, b, v) {
      try {
        d = K.getStr(d);
        var C = v & 256, T = v & 4096;
        return v = v & -6401, E(!v, `unknown flags in __syscall_newfstatat: ${v}`), d = K.calculateAt(c, d, T), K.doStat(C ? F.lstat : F.stat, d, b);
      } catch (U) {
        if (typeof F > "u" || U.name !== "ErrnoError") throw U;
        return -U.errno;
      }
    }
    function Je(c, d, b, v) {
      K.varargs = v;
      try {
        d = K.getStr(d), d = K.calculateAt(c, d);
        var C = v ? Gt() : 0;
        return F.open(d, b, C).fd;
      } catch (T) {
        if (typeof F > "u" || T.name !== "ErrnoError") throw T;
        return -T.errno;
      }
    }
    function Vt(c) {
      try {
        return c = K.getStr(c), F.rmdir(c), 0;
      } catch (d) {
        if (typeof F > "u" || d.name !== "ErrnoError") throw d;
        return -d.errno;
      }
    }
    function En(c, d) {
      try {
        return c = K.getStr(c), K.doStat(F.stat, c, d);
      } catch (b) {
        if (typeof F > "u" || b.name !== "ErrnoError") throw b;
        return -b.errno;
      }
    }
    function dr(c, d, b) {
      try {
        return d = K.getStr(d), d = K.calculateAt(c, d), b === 0 ? F.unlink(d) : b === 512 ? F.rmdir(d) : Le("Invalid flags passed to unlinkat"), 0;
      } catch (v) {
        if (typeof F > "u" || v.name !== "ErrnoError") throw v;
        return -v.errno;
      }
    }
    var Ze = () => {
      Le("native code called abort()");
    }, at = (c, d, b) => z.copyWithin(c, d, d + b), Ft = () => {
      throw 1 / 0;
    };
    function mr(c, d, b) {
      var v = re(c, d), C = new Date(v * 1e3);
      N[b >> 2] = C.getUTCSeconds(), N[b + 4 >> 2] = C.getUTCMinutes(), N[b + 8 >> 2] = C.getUTCHours(), N[b + 12 >> 2] = C.getUTCDate(), N[b + 16 >> 2] = C.getUTCMonth(), N[b + 20 >> 2] = C.getUTCFullYear() - 1900, N[b + 24 >> 2] = C.getUTCDay();
      var T = Date.UTC(C.getUTCFullYear(), 0, 1, 0, 0, 0, 0), U = (C.getTime() - T) / (1e3 * 60 * 60 * 24) | 0;
      N[b + 28 >> 2] = U;
    }
    var js = (c) => c % 4 === 0 && (c % 100 !== 0 || c % 400 === 0), Bs = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335], Ns = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334], $s = (c) => {
      var d = js(c.getFullYear()), b = d ? Bs : Ns, v = b[c.getMonth()] + c.getDate() - 1;
      return v;
    };
    function Us(c, d, b) {
      var v = re(c, d), C = new Date(v * 1e3);
      N[b >> 2] = C.getSeconds(), N[b + 4 >> 2] = C.getMinutes(), N[b + 8 >> 2] = C.getHours(), N[b + 12 >> 2] = C.getDate(), N[b + 16 >> 2] = C.getMonth(), N[b + 20 >> 2] = C.getFullYear() - 1900, N[b + 24 >> 2] = C.getDay();
      var T = $s(C) | 0;
      N[b + 28 >> 2] = T, N[b + 36 >> 2] = -(C.getTimezoneOffset() * 60);
      var U = new Date(C.getFullYear(), 0, 1), X = new Date(C.getFullYear(), 6, 1).getTimezoneOffset(), le = U.getTimezoneOffset(), Pe = (X != le && C.getTimezoneOffset() == Math.min(le, X)) | 0;
      N[b + 32 >> 2] = Pe;
    }
    var zs = (c, d, b, v) => {
      var C = (/* @__PURE__ */ new Date()).getFullYear(), T = new Date(C, 0, 1), U = new Date(C, 6, 1), X = T.getTimezoneOffset(), le = U.getTimezoneOffset(), Pe = Math.max(X, le);
      V[c >> 2] = Pe * 60, N[d >> 2] = +(X != le);
      var xe = (Fe) => {
        var De = Fe >= 0 ? "-" : "+", We = Math.abs(Fe), Tt = String(Math.floor(We / 60)).padStart(2, "0"), Dt = String(We % 60).padStart(2, "0");
        return `UTC${De}${Tt}${Dt}`;
      }, Se = xe(X), ke = xe(le);
      E(Se), E(ke), E(Ht(Se) <= 16, `timezone name truncated to fit in TZNAME_MAX (${Se})`), E(Ht(ke) <= 16, `timezone name truncated to fit in TZNAME_MAX (${ke})`), le < X ? (me(Se, b, 17), me(ke, v, 17)) : (me(Se, v, 17), me(ke, b, 17));
    }, Hs = () => Date.now(), Ws = () => 2147483648, Vs = (c) => {
      var d = k.buffer, b = (c - d.byteLength + 65535) / 65536 | 0;
      try {
        return k.grow(b), ne(), 1;
      } catch (v) {
        A(`growMemory: Attempted to grow heap from ${d.byteLength} bytes to ${c} bytes, but got error: ${v}`);
      }
    }, Ks = (c) => {
      var d = z.length;
      c >>>= 0, E(c > d);
      var b = Ws();
      if (c > b) return A(`Cannot enlarge memory, requested ${c} bytes, but the limit is ${b} bytes!`), false;
      for (var v = 1; v <= 4; v *= 2) {
        var C = d * (1 + 0.2 / v);
        C = Math.min(C, c + 100663296);
        var T = Math.min(b, ot(Math.max(c, C), 65536)), U = Vs(T);
        if (U) return true;
      }
      return A(`Failed to grow the heap from ${d} bytes to ${T} bytes, not enough memory!`), false;
    }, $r = {}, Xs = () => m || "./this.program", Nn = () => {
      if (!Nn.strings) {
        var c = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8", d = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: c, _: Xs() };
        for (var b in $r) $r[b] === void 0 ? delete d[b] : d[b] = $r[b];
        var v = [];
        for (var b in d) v.push(`${b}=${d[b]}`);
        Nn.strings = v;
      }
      return Nn.strings;
    }, qs = (c, d) => {
      for (var b = 0; b < c.length; ++b) E(c.charCodeAt(b) === (c.charCodeAt(b) & 255)), B[d++] = c.charCodeAt(b);
      B[d] = 0;
    }, Ys = (c, d) => {
      var b = 0;
      return Nn().forEach((v, C) => {
        var T = d + b;
        V[c + C * 4 >> 2] = T, qs(v, T), b += v.length + 1;
      }), 0;
    }, Js = (c, d) => {
      var b = Nn();
      V[c >> 2] = b.length;
      var v = 0;
      return b.forEach((C) => v += C.length + 1), V[d >> 2] = v, 0;
    };
    function Zs(c) {
      try {
        var d = K.getStreamFromFD(c);
        return F.close(d), 0;
      } catch (b) {
        if (typeof F > "u" || b.name !== "ErrnoError") throw b;
        return b.errno;
      }
    }
    var Qs = (c, d, b, v) => {
      for (var C = 0, T = 0; T < b; T++) {
        var U = V[d >> 2], X = V[d + 4 >> 2];
        d += 8;
        var le = F.read(c, B, U, X, v);
        if (le < 0) return -1;
        if (C += le, le < X) break;
      }
      return C;
    };
    function ei(c, d, b, v) {
      try {
        var C = K.getStreamFromFD(c), T = Qs(C, d, b);
        return V[v >> 2] = T, 0;
      } catch (U) {
        if (typeof F > "u" || U.name !== "ErrnoError") throw U;
        return U.errno;
      }
    }
    function ti(c, d, b, v, C) {
      var T = re(d, b);
      try {
        if (isNaN(T)) return 61;
        var U = K.getStreamFromFD(c);
        return F.llseek(U, T, v), je = [U.position >>> 0, (be = U.position, +Math.abs(be) >= 1 ? be > 0 ? +Math.floor(be / 4294967296) >>> 0 : ~~+Math.ceil((be - +(~~be >>> 0)) / 4294967296) >>> 0 : 0)], N[C >> 2] = je[0], N[C + 4 >> 2] = je[1], U.getdents && T === 0 && v === 0 && (U.getdents = null), 0;
      } catch (X) {
        if (typeof F > "u" || X.name !== "ErrnoError") throw X;
        return X.errno;
      }
    }
    function ni(c) {
      try {
        var d = K.getStreamFromFD(c);
        return d.stream_ops?.fsync ? d.stream_ops.fsync(d) : 0;
      } catch (b) {
        if (typeof F > "u" || b.name !== "ErrnoError") throw b;
        return b.errno;
      }
    }
    var ri = (c, d, b, v) => {
      for (var C = 0, T = 0; T < b; T++) {
        var U = V[d >> 2], X = V[d + 4 >> 2];
        d += 8;
        var le = F.write(c, B, U, X, v);
        if (le < 0) return -1;
        if (C += le, le < X) break;
      }
      return C;
    };
    function oi(c, d, b, v) {
      try {
        var C = K.getStreamFromFD(c), T = ri(C, d, b);
        return V[v >> 2] = T, 0;
      } catch (U) {
        if (typeof F > "u" || U.name !== "ErrnoError") throw U;
        return U.errno;
      }
    }
    var $n = [], Kt, kt = (c) => {
      var d = $n[c];
      return d || (c >= $n.length && ($n.length = c + 1), $n[c] = d = Kt.get(c)), E(Kt.get(c) == d, "JavaScript-side Wasm function table mirror is out of date!"), d;
    }, Lo = typeof TextDecoder < "u" ? new TextDecoder("utf-16le") : void 0, ai = (c, d) => {
      E(c % 2 == 0, "Pointer passed to UTF16ToString must be aligned to two bytes!");
      for (var b = c, v = b >> 1, C = v + d / 2; !(v >= C) && W[v]; ) ++v;
      if (b = v << 1, b - c > 32 && Lo) return Lo.decode(z.subarray(c, b));
      for (var T = "", U = 0; !(U >= d / 2); ++U) {
        var X = O[c + U * 2 >> 1];
        if (X == 0) break;
        T += String.fromCharCode(X);
      }
      return T;
    }, jo = (c, d) => {
      E(c < 16384), c < 128 ? d.push(c) : d.push(c % 128 | 128, c >> 7);
    }, si = (c) => {
      E(!c.includes("j"), "i64 not permitted in function signatures when WASM_BIGINT is disabled");
      for (var d = { i: "i32", j: "i64", f: "f32", d: "f64", e: "externref", p: "i32" }, b = { parameters: [], results: c[0] == "v" ? [] : [d[c[0]]] }, v = 1; v < c.length; ++v) E(c[v] in d, "invalid signature char: " + c[v]), b.parameters.push(d[c[v]]);
      return b;
    }, ii = (c, d) => {
      var b = c.slice(0, 1), v = c.slice(1), C = { i: 127, p: 127, j: 126, f: 125, d: 124, e: 111 };
      d.push(96), jo(v.length, d);
      for (var T = 0; T < v.length; ++T) E(v[T] in C, "invalid signature char: " + v[T]), d.push(C[v[T]]);
      b == "v" ? d.push(0) : d.push(1, C[b]);
    }, li = (c, d) => {
      if (E(!d.includes("j"), "i64 not permitted in function signatures when WASM_BIGINT is disabled"), typeof WebAssembly.Function == "function") return new WebAssembly.Function(si(d), c);
      var b = [1];
      ii(d, b);
      var v = [0, 97, 115, 109, 1, 0, 0, 0, 1];
      jo(b.length, v), v.push(...b), v.push(2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0);
      var C = new WebAssembly.Module(new Uint8Array(v)), T = new WebAssembly.Instance(C, { e: { f: c } }), U = T.exports.f;
      return U;
    }, ci = (c, d) => {
      if (mn) for (var b = c; b < c + d; b++) {
        var v = kt(b);
        v && mn.set(v, b);
      }
    }, mn, ui = (c) => (mn || (mn = /* @__PURE__ */ new WeakMap(), ci(0, Kt.length)), mn.get(c) || 0), Ur = [], hi = () => {
      if (Ur.length) return Ur.pop();
      try {
        Kt.grow(1);
      } catch (c) {
        throw c instanceof RangeError ? "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH." : c;
      }
      return Kt.length - 1;
    }, zr = (c, d) => {
      Kt.set(c, d), $n[c] = Kt.get(c);
    }, di = (c, d) => {
      E(typeof c < "u");
      var b = ui(c);
      if (b) return b;
      var v = hi();
      try {
        zr(v, c);
      } catch (T) {
        if (!(T instanceof TypeError)) throw T;
        E(typeof d < "u", "Missing signature argument to addFunction: " + c);
        var C = li(c, d);
        zr(v, C);
      }
      return mn.set(c, v), v;
    }, mi = (c) => {
      var d = e["_" + c];
      return E(d, "Cannot call unknown function " + c + ", make sure it is exported"), d;
    }, fi = (c, d) => {
      E(c.length >= 0, "writeArrayToMemory array must have a length (should be an array or typed array)"), B.set(c, d);
    }, Bo = (c) => Ho(c), _i = (c) => {
      var d = Ht(c) + 1, b = Bo(d);
      return me(c, b, d), b;
    }, No = (c, d, b, v, C) => {
      var T = { string: (De) => {
        var We = 0;
        return De != null && De !== 0 && (We = _i(De)), We;
      }, array: (De) => {
        var We = Bo(De.length);
        return fi(De, We), We;
      } };
      function U(De) {
        return d === "string" ? xt(De) : d === "boolean" ? !!De : De;
      }
      var X = mi(c), le = [], Pe = 0;
      if (E(d !== "array", 'Return type should not be "array".'), v) for (var xe = 0; xe < v.length; xe++) {
        var Se = T[b[xe]];
        Se ? (Pe === 0 && (Pe = ut()), le[xe] = Se(v[xe])) : le[xe] = v[xe];
      }
      var ke = X(...le);
      function Fe(De) {
        return Pe !== 0 && rt(Pe), U(De);
      }
      return ke = Fe(ke), ke;
    }, pi = (c, d, b, v) => (...C) => No(c, d, b, C), Fi = (c) => {
      mn.delete(kt(c)), zr(c, null), Ur.push(c);
    }, gi = (c, d, b) => {
      if (E(d % 2 == 0, "Pointer passed to stringToUTF16 must be aligned to two bytes!"), E(typeof b == "number", "stringToUTF16(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!"), b ??= 2147483647, b < 2) return 0;
      b -= 2;
      for (var v = d, C = b < c.length * 2 ? b / 2 : c.length, T = 0; T < C; ++T) {
        var U = c.charCodeAt(T);
        O[d >> 1] = U, d += 2;
      }
      return O[d >> 1] = 0, d - v;
    };
    F.createPreloadedFile = S, F.staticInit();
    function bi() {
      wn("fetchSettings");
    }
    var $o = { __assert_fail: An, __syscall_fcntl64: se, __syscall_fstat64: te, __syscall_ftruncate64: ie, __syscall_getdents64: pe, __syscall_ioctl: Ie, __syscall_lstat64: Me, __syscall_newfstatat: Ye, __syscall_openat: Je, __syscall_rmdir: Vt, __syscall_stat64: En, __syscall_unlinkat: dr, _abort_js: Ze, _emscripten_memcpy_js: at, _emscripten_throw_longjmp: Ft, _gmtime_js: mr, _localtime_js: Us, _tzset_js: zs, emscripten_date_now: Hs, emscripten_resize_heap: Ks, environ_get: Ys, environ_sizes_get: Js, fd_close: Zs, fd_read: ei, fd_seek: ti, fd_sync: ni, fd_write: oi, invoke_ii: vi, invoke_iii: xi, invoke_iiii: Ai, invoke_iiiii: ki, invoke_v: Ci, invoke_vi: Si, invoke_vii: Ei, invoke_viii: wi, invoke_viiii: Mi, invoke_viiiiiiiii: Gi }, Pt = Bn();
    e._PDFiumExt_Init = f("PDFiumExt_Init", 0), e._FPDF_InitLibraryWithConfig = f("FPDF_InitLibraryWithConfig", 1), e._PDFiumExt_OpenFileWriter = f("PDFiumExt_OpenFileWriter", 0), e._PDFiumExt_GetFileWriterSize = f("PDFiumExt_GetFileWriterSize", 1), e._PDFiumExt_GetFileWriterData = f("PDFiumExt_GetFileWriterData", 3), e._PDFiumExt_CloseFileWriter = f("PDFiumExt_CloseFileWriter", 1), e._PDFiumExt_SaveAsCopy = f("PDFiumExt_SaveAsCopy", 2), e._FPDF_SaveAsCopy = f("FPDF_SaveAsCopy", 3), e._PDFiumExt_OpenFormFillInfo = f("PDFiumExt_OpenFormFillInfo", 0), e._PDFiumExt_CloseFormFillInfo = f("PDFiumExt_CloseFormFillInfo", 1), e._PDFiumExt_InitFormFillEnvironment = f("PDFiumExt_InitFormFillEnvironment", 2), e._FPDFDOC_InitFormFillEnvironment = f("FPDFDOC_InitFormFillEnvironment", 2), e._PDFiumExt_ExitFormFillEnvironment = f("PDFiumExt_ExitFormFillEnvironment", 1), e._FPDFDOC_ExitFormFillEnvironment = f("FPDFDOC_ExitFormFillEnvironment", 1), e._EPDFNamedDest_SetDest = f("EPDFNamedDest_SetDest", 3), e._EPDFNamedDest_Remove = f("EPDFNamedDest_Remove", 2), e._EPDFDest_CreateView = f("EPDFDest_CreateView", 4), e._EPDFDest_CreateXYZ = f("EPDFDest_CreateXYZ", 7), e._EPDFDest_CreateRemoteView = f("EPDFDest_CreateRemoteView", 5), e._EPDFDest_CreateRemoteXYZ = f("EPDFDest_CreateRemoteXYZ", 8), e._EPDFAction_CreateGoTo = f("EPDFAction_CreateGoTo", 2), e._EPDFAction_CreateGoToNamed = f("EPDFAction_CreateGoToNamed", 2), e._EPDFAction_CreateLaunch = f("EPDFAction_CreateLaunch", 2), e._EPDFAction_CreateRemoteGoToByName = f("EPDFAction_CreateRemoteGoToByName", 3), e._EPDFAction_CreateRemoteGoToDest = f("EPDFAction_CreateRemoteGoToDest", 3), e._EPDFAction_CreateURI = f("EPDFAction_CreateURI", 2), e._EPDFBookmark_Create = f("EPDFBookmark_Create", 2), e._EPDFBookmark_Delete = f("EPDFBookmark_Delete", 2), e._EPDFBookmark_AppendChild = f("EPDFBookmark_AppendChild", 3), e._EPDFBookmark_InsertAfter = f("EPDFBookmark_InsertAfter", 4), e._EPDFBookmark_Clear = f("EPDFBookmark_Clear", 1), e._EPDFBookmark_SetTitle = f("EPDFBookmark_SetTitle", 2), e._EPDFBookmark_SetDest = f("EPDFBookmark_SetDest", 3), e._EPDFBookmark_SetAction = f("EPDFBookmark_SetAction", 3), e._EPDFBookmark_ClearTarget = f("EPDFBookmark_ClearTarget", 1), e._EPDF_PNG_EncodeRGBA = f("EPDF_PNG_EncodeRGBA", 6), e._FPDFAnnot_IsSupportedSubtype = f("FPDFAnnot_IsSupportedSubtype", 1), e._FPDFPage_CreateAnnot = f("FPDFPage_CreateAnnot", 2), e._FPDFPage_GetAnnotCount = f("FPDFPage_GetAnnotCount", 1), e._FPDFPage_GetAnnot = f("FPDFPage_GetAnnot", 2), e._FPDFPage_GetAnnotIndex = f("FPDFPage_GetAnnotIndex", 2), e._FPDFPage_CloseAnnot = f("FPDFPage_CloseAnnot", 1), e._FPDFPage_RemoveAnnot = f("FPDFPage_RemoveAnnot", 2), e._FPDFAnnot_GetSubtype = f("FPDFAnnot_GetSubtype", 1), e._FPDFAnnot_IsObjectSupportedSubtype = f("FPDFAnnot_IsObjectSupportedSubtype", 1), e._FPDFAnnot_UpdateObject = f("FPDFAnnot_UpdateObject", 2), e._FPDFAnnot_AddInkStroke = f("FPDFAnnot_AddInkStroke", 3), e._FPDFAnnot_RemoveInkList = f("FPDFAnnot_RemoveInkList", 1), e._FPDFAnnot_AppendObject = f("FPDFAnnot_AppendObject", 2), e._FPDFAnnot_GetObjectCount = f("FPDFAnnot_GetObjectCount", 1), e._FPDFAnnot_GetObject = f("FPDFAnnot_GetObject", 2), e._FPDFAnnot_RemoveObject = f("FPDFAnnot_RemoveObject", 2), e._FPDFAnnot_SetColor = f("FPDFAnnot_SetColor", 6), e._FPDFAnnot_GetColor = f("FPDFAnnot_GetColor", 6), e._FPDFAnnot_HasAttachmentPoints = f("FPDFAnnot_HasAttachmentPoints", 1), e._FPDFAnnot_SetAttachmentPoints = f("FPDFAnnot_SetAttachmentPoints", 3), e._FPDFAnnot_AppendAttachmentPoints = f("FPDFAnnot_AppendAttachmentPoints", 2), e._FPDFAnnot_CountAttachmentPoints = f("FPDFAnnot_CountAttachmentPoints", 1), e._FPDFAnnot_GetAttachmentPoints = f("FPDFAnnot_GetAttachmentPoints", 3), e._FPDFAnnot_SetRect = f("FPDFAnnot_SetRect", 2), e._FPDFAnnot_GetRect = f("FPDFAnnot_GetRect", 2), e._FPDFAnnot_GetVertices = f("FPDFAnnot_GetVertices", 3), e._FPDFAnnot_GetInkListCount = f("FPDFAnnot_GetInkListCount", 1), e._FPDFAnnot_GetInkListPath = f("FPDFAnnot_GetInkListPath", 4), e._FPDFAnnot_GetLine = f("FPDFAnnot_GetLine", 3), e._FPDFAnnot_SetBorder = f("FPDFAnnot_SetBorder", 4), e._FPDFAnnot_GetBorder = f("FPDFAnnot_GetBorder", 4), e._FPDFAnnot_HasKey = f("FPDFAnnot_HasKey", 2), e._FPDFAnnot_GetValueType = f("FPDFAnnot_GetValueType", 2), e._FPDFAnnot_SetStringValue = f("FPDFAnnot_SetStringValue", 3), e._FPDFAnnot_GetStringValue = f("FPDFAnnot_GetStringValue", 4), e._FPDFAnnot_GetNumberValue = f("FPDFAnnot_GetNumberValue", 3), e._EPDFAnnot_SetNumberValue = f("EPDFAnnot_SetNumberValue", 3), e._FPDFAnnot_SetAP = f("FPDFAnnot_SetAP", 3), e._FPDFAnnot_GetAP = f("FPDFAnnot_GetAP", 4), e._FPDFAnnot_GetLinkedAnnot = f("FPDFAnnot_GetLinkedAnnot", 2), e._FPDFAnnot_GetFlags = f("FPDFAnnot_GetFlags", 1), e._FPDFAnnot_SetFlags = f("FPDFAnnot_SetFlags", 2), e._FPDFAnnot_GetFormFieldFlags = f("FPDFAnnot_GetFormFieldFlags", 2), e._FPDFAnnot_SetFormFieldFlags = f("FPDFAnnot_SetFormFieldFlags", 3), e._FPDFAnnot_GetFormFieldAtPoint = f("FPDFAnnot_GetFormFieldAtPoint", 3), e._FPDFAnnot_GetFormFieldName = f("FPDFAnnot_GetFormFieldName", 4), e._FPDFAnnot_GetFormFieldType = f("FPDFAnnot_GetFormFieldType", 2), e._FPDFAnnot_GetFormAdditionalActionJavaScript = f("FPDFAnnot_GetFormAdditionalActionJavaScript", 5), e._FPDFAnnot_GetFormFieldAlternateName = f("FPDFAnnot_GetFormFieldAlternateName", 4), e._FPDFAnnot_GetFormFieldValue = f("FPDFAnnot_GetFormFieldValue", 4), e._FPDFAnnot_GetOptionCount = f("FPDFAnnot_GetOptionCount", 2), e._FPDFAnnot_GetOptionLabel = f("FPDFAnnot_GetOptionLabel", 5), e._FPDFAnnot_IsOptionSelected = f("FPDFAnnot_IsOptionSelected", 3), e._FPDFAnnot_GetFontSize = f("FPDFAnnot_GetFontSize", 3), e._FPDFAnnot_SetFontColor = f("FPDFAnnot_SetFontColor", 5), e._FPDFAnnot_GetFontColor = f("FPDFAnnot_GetFontColor", 5), e._FPDFAnnot_IsChecked = f("FPDFAnnot_IsChecked", 2), e._FPDFAnnot_SetFocusableSubtypes = f("FPDFAnnot_SetFocusableSubtypes", 3), e._FPDFAnnot_GetFocusableSubtypesCount = f("FPDFAnnot_GetFocusableSubtypesCount", 1), e._FPDFAnnot_GetFocusableSubtypes = f("FPDFAnnot_GetFocusableSubtypes", 3), e._FPDFAnnot_GetLink = f("FPDFAnnot_GetLink", 1), e._FPDFAnnot_GetFormControlCount = f("FPDFAnnot_GetFormControlCount", 2), e._FPDFAnnot_GetFormControlIndex = f("FPDFAnnot_GetFormControlIndex", 2), e._FPDFAnnot_GetFormFieldExportValue = f("FPDFAnnot_GetFormFieldExportValue", 4), e._FPDFAnnot_SetURI = f("FPDFAnnot_SetURI", 2), e._EPDFAnnot_SetAction = f("EPDFAnnot_SetAction", 2), e._FPDFAnnot_GetFileAttachment = f("FPDFAnnot_GetFileAttachment", 1), e._FPDFAnnot_AddFileAttachment = f("FPDFAnnot_AddFileAttachment", 2), e._EPDFAnnot_SetColor = f("EPDFAnnot_SetColor", 5), e._EPDFAnnot_GetColor = f("EPDFAnnot_GetColor", 5), e._EPDFAnnot_ClearColor = f("EPDFAnnot_ClearColor", 2), e._EPDFAnnot_SetOpacity = f("EPDFAnnot_SetOpacity", 2), e._EPDFAnnot_GetOpacity = f("EPDFAnnot_GetOpacity", 2), e._EPDFAnnot_GetBorderEffect = f("EPDFAnnot_GetBorderEffect", 2), e._EPDFAnnot_SetBorderEffect = f("EPDFAnnot_SetBorderEffect", 2), e._EPDFAnnot_ClearBorderEffect = f("EPDFAnnot_ClearBorderEffect", 1), e._EPDFAnnot_GetRectangleDifferences = f("EPDFAnnot_GetRectangleDifferences", 5), e._EPDFAnnot_SetRectangleDifferences = f("EPDFAnnot_SetRectangleDifferences", 5), e._EPDFAnnot_ClearRectangleDifferences = f("EPDFAnnot_ClearRectangleDifferences", 1), e._EPDFAnnot_GetBorderDashPatternCount = f("EPDFAnnot_GetBorderDashPatternCount", 1), e._EPDFAnnot_GetBorderDashPattern = f("EPDFAnnot_GetBorderDashPattern", 3), e._EPDFAnnot_SetBorderDashPattern = f("EPDFAnnot_SetBorderDashPattern", 3), e._EPDFAnnot_GetBorderStyle = f("EPDFAnnot_GetBorderStyle", 2), e._EPDFAnnot_SetBorderStyle = f("EPDFAnnot_SetBorderStyle", 3), e._EPDFAnnot_GenerateAppearance = f("EPDFAnnot_GenerateAppearance", 1), e._EPDFAnnot_GenerateAppearanceWithBlend = f("EPDFAnnot_GenerateAppearanceWithBlend", 2), e._EPDFAnnot_GetBlendMode = f("EPDFAnnot_GetBlendMode", 1), e._EPDFAnnot_SetIntent = f("EPDFAnnot_SetIntent", 2), e._EPDFAnnot_GetIntent = f("EPDFAnnot_GetIntent", 3), e._EPDFAnnot_GetRichContent = f("EPDFAnnot_GetRichContent", 3), e._EPDFAnnot_SetLineEndings = f("EPDFAnnot_SetLineEndings", 3), e._EPDFAnnot_GetLineEndings = f("EPDFAnnot_GetLineEndings", 3), e._EPDFAnnot_SetVertices = f("EPDFAnnot_SetVertices", 3), e._EPDFAnnot_SetLine = f("EPDFAnnot_SetLine", 3), e._EPDFAnnot_SetDefaultAppearance = f("EPDFAnnot_SetDefaultAppearance", 6), e._EPDFAnnot_GetDefaultAppearance = f("EPDFAnnot_GetDefaultAppearance", 6), e._EPDFAnnot_SetTextAlignment = f("EPDFAnnot_SetTextAlignment", 2), e._EPDFAnnot_GetTextAlignment = f("EPDFAnnot_GetTextAlignment", 1), e._EPDFAnnot_SetVerticalAlignment = f("EPDFAnnot_SetVerticalAlignment", 2), e._EPDFAnnot_GetVerticalAlignment = f("EPDFAnnot_GetVerticalAlignment", 1), e._EPDFPage_GetAnnotByName = f("EPDFPage_GetAnnotByName", 2), e._EPDFPage_RemoveAnnotByName = f("EPDFPage_RemoveAnnotByName", 2), e._EPDFAnnot_SetLinkedAnnot = f("EPDFAnnot_SetLinkedAnnot", 3), e._EPDFPage_GetAnnotCountRaw = f("EPDFPage_GetAnnotCountRaw", 2), e._EPDFPage_GetAnnotRaw = f("EPDFPage_GetAnnotRaw", 3), e._EPDFPage_RemoveAnnotRaw = f("EPDFPage_RemoveAnnotRaw", 3), e._EPDFAnnot_SetName = f("EPDFAnnot_SetName", 2), e._EPDFAnnot_GetName = f("EPDFAnnot_GetName", 1), e._EPDFAnnot_UpdateAppearanceToRect = f("EPDFAnnot_UpdateAppearanceToRect", 2), e._EPDFPage_CreateAnnot = f("EPDFPage_CreateAnnot", 2), e._EPDFAnnot_SetRotate = f("EPDFAnnot_SetRotate", 2), e._EPDFAnnot_GetRotate = f("EPDFAnnot_GetRotate", 2), e._EPDFAnnot_GetReplyType = f("EPDFAnnot_GetReplyType", 1), e._EPDFAnnot_SetReplyType = f("EPDFAnnot_SetReplyType", 2), e._EPDFAnnot_SetOverlayText = f("EPDFAnnot_SetOverlayText", 2), e._EPDFAnnot_GetOverlayText = f("EPDFAnnot_GetOverlayText", 3), e._EPDFAnnot_SetOverlayTextRepeat = f("EPDFAnnot_SetOverlayTextRepeat", 2), e._EPDFAnnot_GetOverlayTextRepeat = f("EPDFAnnot_GetOverlayTextRepeat", 1), e._EPDFAnnot_ApplyRedaction = f("EPDFAnnot_ApplyRedaction", 2), e._EPDFPage_ApplyRedactions = f("EPDFPage_ApplyRedactions", 1), e._EPDFAnnot_Flatten = f("EPDFAnnot_Flatten", 2), e._EPDFAnnot_SetAppearanceFromPage = f("EPDFAnnot_SetAppearanceFromPage", 3), e._EPDFAnnot_ExportAppearanceAsDocument = f("EPDFAnnot_ExportAppearanceAsDocument", 1), e._EPDFAnnot_ExportMultipleAppearancesAsDocument = f("EPDFAnnot_ExportMultipleAppearancesAsDocument", 2), e._EPDFAnnot_SetExtendedRotation = f("EPDFAnnot_SetExtendedRotation", 2), e._EPDFAnnot_GetExtendedRotation = f("EPDFAnnot_GetExtendedRotation", 2), e._EPDFAnnot_SetUnrotatedRect = f("EPDFAnnot_SetUnrotatedRect", 2), e._EPDFAnnot_GetUnrotatedRect = f("EPDFAnnot_GetUnrotatedRect", 2), e._EPDFAnnot_GetRect = f("EPDFAnnot_GetRect", 2), e._EPDFAnnot_SetAPMatrix = f("EPDFAnnot_SetAPMatrix", 3), e._EPDFAnnot_GetAPMatrix = f("EPDFAnnot_GetAPMatrix", 3), e._EPDFAnnot_GetAvailableAppearanceModes = f("EPDFAnnot_GetAvailableAppearanceModes", 1), e._EPDFAnnot_HasAppearanceStream = f("EPDFAnnot_HasAppearanceStream", 2), e._EPDFAnnot_SetMKColor = f("EPDFAnnot_SetMKColor", 5), e._EPDFAnnot_GetMKColor = f("EPDFAnnot_GetMKColor", 5), e._EPDFAnnot_ClearMKColor = f("EPDFAnnot_ClearMKColor", 2), e._EPDFPage_CreateFormField = f("EPDFPage_CreateFormField", 4), e._EPDFAnnot_GenerateFormFieldAP = f("EPDFAnnot_GenerateFormFieldAP", 1), e._EPDFAnnot_GetButtonExportValue = f("EPDFAnnot_GetButtonExportValue", 3), e._EPDFAnnot_GetFormFieldRawValue = f("EPDFAnnot_GetFormFieldRawValue", 4), e._EPDFAnnot_SetFormFieldValue = f("EPDFAnnot_SetFormFieldValue", 3), e._EPDFAnnot_SetFormFieldName = f("EPDFAnnot_SetFormFieldName", 3), e._EPDFAnnot_GetFormFieldObjectNumber = f("EPDFAnnot_GetFormFieldObjectNumber", 2), e._EPDFAnnot_ShareFormField = f("EPDFAnnot_ShareFormField", 3), e._EPDFAnnot_GetCalloutLineCount = f("EPDFAnnot_GetCalloutLineCount", 1), e._EPDFAnnot_GetCalloutLine = f("EPDFAnnot_GetCalloutLine", 3), e._EPDFAnnot_SetCalloutLine = f("EPDFAnnot_SetCalloutLine", 3), e._EPDFAnnot_SetFormFieldOptions = f("EPDFAnnot_SetFormFieldOptions", 4), e._EPDFAnnot_GetObjectNumber = f("EPDFAnnot_GetObjectNumber", 1), e._EPDFPage_GetAnnotByObjectNumber = f("EPDFPage_GetAnnotByObjectNumber", 2), e._EPDFPage_RemoveAnnot = f("EPDFPage_RemoveAnnot", 2), e._EPDFPage_RemoveAnnotByObjectNumber = f("EPDFPage_RemoveAnnotByObjectNumber", 2), e._EPDFPage_MoveAnnots = f("EPDFPage_MoveAnnots", 4), e._FPDFDoc_GetAttachmentCount = f("FPDFDoc_GetAttachmentCount", 1), e._FPDFDoc_AddAttachment = f("FPDFDoc_AddAttachment", 2), e._FPDFDoc_GetAttachment = f("FPDFDoc_GetAttachment", 2), e._FPDFDoc_DeleteAttachment = f("FPDFDoc_DeleteAttachment", 2), e._FPDFAttachment_GetName = f("FPDFAttachment_GetName", 3), e._FPDFAttachment_HasKey = f("FPDFAttachment_HasKey", 2), e._FPDFAttachment_GetValueType = f("FPDFAttachment_GetValueType", 2), e._FPDFAttachment_SetStringValue = f("FPDFAttachment_SetStringValue", 3), e._FPDFAttachment_GetStringValue = f("FPDFAttachment_GetStringValue", 4), e._FPDFAttachment_SetFile = f("FPDFAttachment_SetFile", 4), e._FPDFAttachment_GetFile = f("FPDFAttachment_GetFile", 4), e._FPDFAttachment_GetSubtype = f("FPDFAttachment_GetSubtype", 3), e._EPDFAttachment_SetSubtype = f("EPDFAttachment_SetSubtype", 2), e._EPDFAttachment_SetDescription = f("EPDFAttachment_SetDescription", 2), e._EPDFAttachment_GetDescription = f("EPDFAttachment_GetDescription", 3), e._EPDFAttachment_GetIntegerValue = f("EPDFAttachment_GetIntegerValue", 3), e._FPDFCatalog_IsTagged = f("FPDFCatalog_IsTagged", 1), e._FPDFCatalog_GetLanguage = f("FPDFCatalog_GetLanguage", 3), e._FPDFCatalog_SetLanguage = f("FPDFCatalog_SetLanguage", 2), e._EPDFCatalog_GetLanguage = f("EPDFCatalog_GetLanguage", 3), e._FPDFAvail_Create = f("FPDFAvail_Create", 2), e._FPDFAvail_Destroy = f("FPDFAvail_Destroy", 1), e._FPDFAvail_IsDocAvail = f("FPDFAvail_IsDocAvail", 2), e._FPDFAvail_GetDocument = f("FPDFAvail_GetDocument", 2), e._FPDFAvail_GetFirstPageNum = f("FPDFAvail_GetFirstPageNum", 1), e._FPDFAvail_IsPageAvail = f("FPDFAvail_IsPageAvail", 3), e._FPDFAvail_IsFormAvail = f("FPDFAvail_IsFormAvail", 2), e._FPDFAvail_IsLinearized = f("FPDFAvail_IsLinearized", 1), e._FPDFBookmark_GetFirstChild = f("FPDFBookmark_GetFirstChild", 2), e._FPDFBookmark_GetNextSibling = f("FPDFBookmark_GetNextSibling", 2), e._FPDFBookmark_GetTitle = f("FPDFBookmark_GetTitle", 3), e._FPDFBookmark_GetCount = f("FPDFBookmark_GetCount", 1), e._FPDFBookmark_Find = f("FPDFBookmark_Find", 2), e._FPDFBookmark_GetDest = f("FPDFBookmark_GetDest", 2), e._FPDFBookmark_GetAction = f("FPDFBookmark_GetAction", 1), e._FPDFAction_GetType = f("FPDFAction_GetType", 1), e._FPDFAction_GetDest = f("FPDFAction_GetDest", 2), e._FPDFAction_GetFilePath = f("FPDFAction_GetFilePath", 3), e._FPDFAction_GetURIPath = f("FPDFAction_GetURIPath", 4), e._FPDFDest_GetDestPageIndex = f("FPDFDest_GetDestPageIndex", 2), e._FPDFDest_GetView = f("FPDFDest_GetView", 3), e._FPDFDest_GetLocationInPage = f("FPDFDest_GetLocationInPage", 7), e._FPDFLink_GetLinkAtPoint = f("FPDFLink_GetLinkAtPoint", 3), e._FPDFLink_GetLinkZOrderAtPoint = f("FPDFLink_GetLinkZOrderAtPoint", 3), e._FPDFLink_GetDest = f("FPDFLink_GetDest", 2), e._FPDFLink_GetAction = f("FPDFLink_GetAction", 1), e._FPDFLink_Enumerate = f("FPDFLink_Enumerate", 3), e._FPDFLink_GetAnnot = f("FPDFLink_GetAnnot", 2), e._FPDFLink_GetAnnotRect = f("FPDFLink_GetAnnotRect", 2), e._FPDFLink_CountQuadPoints = f("FPDFLink_CountQuadPoints", 1), e._FPDFLink_GetQuadPoints = f("FPDFLink_GetQuadPoints", 3), e._FPDF_GetPageAAction = f("FPDF_GetPageAAction", 2), e._FPDF_GetFileIdentifier = f("FPDF_GetFileIdentifier", 4), e._FPDF_GetMetaText = f("FPDF_GetMetaText", 4), e._FPDF_GetPageLabel = f("FPDF_GetPageLabel", 4), e._EPDF_SetMetaText = f("EPDF_SetMetaText", 3), e._EPDF_HasMetaText = f("EPDF_HasMetaText", 2), e._EPDF_GetMetaTrapped = f("EPDF_GetMetaTrapped", 1), e._EPDF_SetMetaTrapped = f("EPDF_SetMetaTrapped", 2), e._EPDF_GetMetaKeyCount = f("EPDF_GetMetaKeyCount", 2), e._EPDF_GetMetaKeyName = f("EPDF_GetMetaKeyName", 5), e._FPDFPageObj_NewImageObj = f("FPDFPageObj_NewImageObj", 1), e._FPDFImageObj_LoadJpegFile = f("FPDFImageObj_LoadJpegFile", 4), e._FPDFImageObj_LoadJpegFileInline = f("FPDFImageObj_LoadJpegFileInline", 4), e._FPDFImageObj_SetMatrix = f("FPDFImageObj_SetMatrix", 7), e._FPDFImageObj_SetBitmap = f("FPDFImageObj_SetBitmap", 4), e._FPDFImageObj_GetBitmap = f("FPDFImageObj_GetBitmap", 1), e._FPDFImageObj_GetRenderedBitmap = f("FPDFImageObj_GetRenderedBitmap", 3), e._FPDFImageObj_GetImageDataDecoded = f("FPDFImageObj_GetImageDataDecoded", 3), e._FPDFImageObj_GetImageDataRaw = f("FPDFImageObj_GetImageDataRaw", 3), e._FPDFImageObj_GetImageFilterCount = f("FPDFImageObj_GetImageFilterCount", 1), e._FPDFImageObj_GetImageFilter = f("FPDFImageObj_GetImageFilter", 4), e._FPDFImageObj_GetImageMetadata = f("FPDFImageObj_GetImageMetadata", 3), e._FPDFImageObj_GetImagePixelSize = f("FPDFImageObj_GetImagePixelSize", 3), e._FPDFImageObj_GetIccProfileDataDecoded = f("FPDFImageObj_GetIccProfileDataDecoded", 5), e._EPDFImageObj_SetPng = f("EPDFImageObj_SetPng", 5), e._EPDFImageObj_SetJpeg = f("EPDFImageObj_SetJpeg", 5), e._FPDF_CreateNewDocument = f("FPDF_CreateNewDocument", 0), e._FPDFPage_Delete = f("FPDFPage_Delete", 2), e._FPDF_MovePages = f("FPDF_MovePages", 4), e._FPDFPage_New = f("FPDFPage_New", 4), e._FPDFPage_GetRotation = f("FPDFPage_GetRotation", 1), e._FPDFPage_InsertObject = f("FPDFPage_InsertObject", 2), e._FPDFPage_InsertObjectAtIndex = f("FPDFPage_InsertObjectAtIndex", 3), e._FPDFPage_RemoveObject = f("FPDFPage_RemoveObject", 2), e._FPDFPage_CountObjects = f("FPDFPage_CountObjects", 1), e._FPDFPage_GetObject = f("FPDFPage_GetObject", 2), e._FPDFPage_HasTransparency = f("FPDFPage_HasTransparency", 1), e._FPDFPageObj_Destroy = f("FPDFPageObj_Destroy", 1), e._FPDFPageObj_GetMarkedContentID = f("FPDFPageObj_GetMarkedContentID", 1), e._FPDFPageObj_CountMarks = f("FPDFPageObj_CountMarks", 1), e._FPDFPageObj_GetMark = f("FPDFPageObj_GetMark", 2), e._FPDFPageObj_AddMark = f("FPDFPageObj_AddMark", 2), e._FPDFPageObj_RemoveMark = f("FPDFPageObj_RemoveMark", 2), e._FPDFPageObjMark_GetName = f("FPDFPageObjMark_GetName", 4), e._FPDFPageObjMark_CountParams = f("FPDFPageObjMark_CountParams", 1), e._FPDFPageObjMark_GetParamKey = f("FPDFPageObjMark_GetParamKey", 5), e._FPDFPageObjMark_GetParamValueType = f("FPDFPageObjMark_GetParamValueType", 2), e._FPDFPageObjMark_GetParamIntValue = f("FPDFPageObjMark_GetParamIntValue", 3), e._FPDFPageObjMark_GetParamFloatValue = f("FPDFPageObjMark_GetParamFloatValue", 3), e._FPDFPageObjMark_GetParamStringValue = f("FPDFPageObjMark_GetParamStringValue", 5), e._FPDFPageObjMark_GetParamBlobValue = f("FPDFPageObjMark_GetParamBlobValue", 5), e._FPDFPageObj_HasTransparency = f("FPDFPageObj_HasTransparency", 1), e._FPDFPageObjMark_SetIntParam = f("FPDFPageObjMark_SetIntParam", 5), e._FPDFPageObjMark_SetFloatParam = f("FPDFPageObjMark_SetFloatParam", 5), e._FPDFPageObjMark_SetStringParam = f("FPDFPageObjMark_SetStringParam", 5), e._FPDFPageObjMark_SetBlobParam = f("FPDFPageObjMark_SetBlobParam", 6), e._FPDFPageObjMark_RemoveParam = f("FPDFPageObjMark_RemoveParam", 3), e._FPDFPageObj_GetType = f("FPDFPageObj_GetType", 1), e._FPDFPageObj_GetIsActive = f("FPDFPageObj_GetIsActive", 2), e._FPDFPageObj_SetIsActive = f("FPDFPageObj_SetIsActive", 2), e._FPDFPage_GenerateContent = f("FPDFPage_GenerateContent", 1), e._FPDFPageObj_Transform = f("FPDFPageObj_Transform", 7), e._FPDFPageObj_TransformF = f("FPDFPageObj_TransformF", 2), e._FPDFPageObj_GetMatrix = f("FPDFPageObj_GetMatrix", 2), e._FPDFPageObj_SetMatrix = f("FPDFPageObj_SetMatrix", 2), e._FPDFPageObj_SetBlendMode = f("FPDFPageObj_SetBlendMode", 2), e._FPDFPage_TransformAnnots = f("FPDFPage_TransformAnnots", 7), e._FPDFPage_SetRotation = f("FPDFPage_SetRotation", 2), e._FPDFPageObj_SetFillColor = f("FPDFPageObj_SetFillColor", 5), e._FPDFPageObj_GetFillColor = f("FPDFPageObj_GetFillColor", 5), e._FPDFPageObj_GetBounds = f("FPDFPageObj_GetBounds", 5), e._FPDFPageObj_GetRotatedBounds = f("FPDFPageObj_GetRotatedBounds", 2), e._FPDFPageObj_SetStrokeColor = f("FPDFPageObj_SetStrokeColor", 5), e._FPDFPageObj_GetStrokeColor = f("FPDFPageObj_GetStrokeColor", 5), e._FPDFPageObj_SetStrokeWidth = f("FPDFPageObj_SetStrokeWidth", 2), e._FPDFPageObj_GetStrokeWidth = f("FPDFPageObj_GetStrokeWidth", 2), e._FPDFPageObj_GetLineJoin = f("FPDFPageObj_GetLineJoin", 1), e._FPDFPageObj_SetLineJoin = f("FPDFPageObj_SetLineJoin", 2), e._FPDFPageObj_GetLineCap = f("FPDFPageObj_GetLineCap", 1), e._FPDFPageObj_SetLineCap = f("FPDFPageObj_SetLineCap", 2), e._FPDFPageObj_GetDashPhase = f("FPDFPageObj_GetDashPhase", 2), e._FPDFPageObj_SetDashPhase = f("FPDFPageObj_SetDashPhase", 2), e._FPDFPageObj_GetDashCount = f("FPDFPageObj_GetDashCount", 1), e._FPDFPageObj_GetDashArray = f("FPDFPageObj_GetDashArray", 3), e._FPDFPageObj_SetDashArray = f("FPDFPageObj_SetDashArray", 4), e._FPDFFormObj_CountObjects = f("FPDFFormObj_CountObjects", 1), e._FPDFFormObj_GetObject = f("FPDFFormObj_GetObject", 2), e._FPDFFormObj_RemoveObject = f("FPDFFormObj_RemoveObject", 2), e._FPDFPageObj_CreateNewPath = f("FPDFPageObj_CreateNewPath", 2), e._FPDFPageObj_CreateNewRect = f("FPDFPageObj_CreateNewRect", 4), e._FPDFPath_CountSegments = f("FPDFPath_CountSegments", 1), e._FPDFPath_GetPathSegment = f("FPDFPath_GetPathSegment", 2), e._FPDFPath_MoveTo = f("FPDFPath_MoveTo", 3), e._FPDFPath_LineTo = f("FPDFPath_LineTo", 3), e._FPDFPath_BezierTo = f("FPDFPath_BezierTo", 7), e._FPDFPath_Close = f("FPDFPath_Close", 1), e._FPDFPath_SetDrawMode = f("FPDFPath_SetDrawMode", 3), e._FPDFPath_GetDrawMode = f("FPDFPath_GetDrawMode", 3), e._FPDFPathSegment_GetPoint = f("FPDFPathSegment_GetPoint", 3), e._FPDFPathSegment_GetType = f("FPDFPathSegment_GetType", 1), e._FPDFPathSegment_GetClose = f("FPDFPathSegment_GetClose", 1), e._FPDFPageObj_NewTextObj = f("FPDFPageObj_NewTextObj", 3), e._FPDFText_SetText = f("FPDFText_SetText", 2), e._FPDFText_SetCharcodes = f("FPDFText_SetCharcodes", 3), e._FPDFText_LoadFont = f("FPDFText_LoadFont", 5), e._FPDFText_LoadStandardFont = f("FPDFText_LoadStandardFont", 2), e._FPDFText_LoadCidType2Font = f("FPDFText_LoadCidType2Font", 6), e._FPDFTextObj_GetFontSize = f("FPDFTextObj_GetFontSize", 2), e._FPDFTextObj_GetText = f("FPDFTextObj_GetText", 4), e._FPDFTextObj_GetRenderedBitmap = f("FPDFTextObj_GetRenderedBitmap", 4), e._FPDFFont_Close = f("FPDFFont_Close", 1), e._FPDFPageObj_CreateTextObj = f("FPDFPageObj_CreateTextObj", 3), e._FPDFTextObj_GetTextRenderMode = f("FPDFTextObj_GetTextRenderMode", 1), e._FPDFTextObj_SetTextRenderMode = f("FPDFTextObj_SetTextRenderMode", 2), e._FPDFTextObj_GetFont = f("FPDFTextObj_GetFont", 1), e._FPDFFont_GetBaseFontName = f("FPDFFont_GetBaseFontName", 3), e._FPDFFont_GetFamilyName = f("FPDFFont_GetFamilyName", 3), e._FPDFFont_GetFontData = f("FPDFFont_GetFontData", 4), e._FPDFFont_GetIsEmbedded = f("FPDFFont_GetIsEmbedded", 1), e._FPDFFont_GetFlags = f("FPDFFont_GetFlags", 1), e._FPDFFont_GetWeight = f("FPDFFont_GetWeight", 1), e._FPDFFont_GetItalicAngle = f("FPDFFont_GetItalicAngle", 2), e._FPDFFont_GetAscent = f("FPDFFont_GetAscent", 3), e._FPDFFont_GetDescent = f("FPDFFont_GetDescent", 3), e._FPDFFont_GetGlyphWidth = f("FPDFFont_GetGlyphWidth", 4), e._FPDFFont_GetGlyphPath = f("FPDFFont_GetGlyphPath", 3), e._FPDFGlyphPath_CountGlyphSegments = f("FPDFGlyphPath_CountGlyphSegments", 1), e._FPDFGlyphPath_GetGlyphPathSegment = f("FPDFGlyphPath_GetGlyphPathSegment", 2), e._EPDFText_RedactInRect = f("EPDFText_RedactInRect", 4), e._EPDFText_RedactInQuads = f("EPDFText_RedactInQuads", 5), e._FPDFDoc_GetPageMode = f("FPDFDoc_GetPageMode", 1), e._FPDFPage_Flatten = f("FPDFPage_Flatten", 2), e._FPDFPage_HasFormFieldAtPoint = f("FPDFPage_HasFormFieldAtPoint", 4), e._FPDFPage_FormFieldZOrderAtPoint = f("FPDFPage_FormFieldZOrderAtPoint", 4), e._malloc = f("malloc", 1), e._free = f("free", 1), e._FORM_OnMouseMove = f("FORM_OnMouseMove", 5), e._FORM_OnMouseWheel = f("FORM_OnMouseWheel", 6), e._FORM_OnFocus = f("FORM_OnFocus", 5), e._FORM_OnLButtonDown = f("FORM_OnLButtonDown", 5), e._FORM_OnLButtonUp = f("FORM_OnLButtonUp", 5), e._FORM_OnLButtonDoubleClick = f("FORM_OnLButtonDoubleClick", 5), e._FORM_OnRButtonDown = f("FORM_OnRButtonDown", 5), e._FORM_OnRButtonUp = f("FORM_OnRButtonUp", 5), e._FORM_OnKeyDown = f("FORM_OnKeyDown", 4), e._FORM_OnKeyUp = f("FORM_OnKeyUp", 4), e._FORM_OnChar = f("FORM_OnChar", 4), e._FORM_GetFocusedText = f("FORM_GetFocusedText", 4), e._FORM_GetSelectedText = f("FORM_GetSelectedText", 4), e._FORM_ReplaceAndKeepSelection = f("FORM_ReplaceAndKeepSelection", 3), e._FORM_ReplaceSelection = f("FORM_ReplaceSelection", 3), e._FORM_SelectAllText = f("FORM_SelectAllText", 2), e._FORM_CanUndo = f("FORM_CanUndo", 2), e._FORM_CanRedo = f("FORM_CanRedo", 2), e._FORM_Undo = f("FORM_Undo", 2), e._FORM_Redo = f("FORM_Redo", 2), e._FORM_ForceToKillFocus = f("FORM_ForceToKillFocus", 1), e._FORM_GetFocusedAnnot = f("FORM_GetFocusedAnnot", 3), e._FORM_SetFocusedAnnot = f("FORM_SetFocusedAnnot", 2), e._FPDF_FFLDraw = f("FPDF_FFLDraw", 9), e._FPDF_SetFormFieldHighlightColor = f("FPDF_SetFormFieldHighlightColor", 3), e._FPDF_SetFormFieldHighlightAlpha = f("FPDF_SetFormFieldHighlightAlpha", 2), e._FPDF_RemoveFormFieldHighlight = f("FPDF_RemoveFormFieldHighlight", 1), e._FORM_OnAfterLoadPage = f("FORM_OnAfterLoadPage", 2), e._FORM_OnBeforeClosePage = f("FORM_OnBeforeClosePage", 2), e._FORM_DoDocumentJSAction = f("FORM_DoDocumentJSAction", 1), e._FORM_DoDocumentOpenAction = f("FORM_DoDocumentOpenAction", 1), e._FORM_DoDocumentAAction = f("FORM_DoDocumentAAction", 2), e._FORM_DoPageAAction = f("FORM_DoPageAAction", 3), e._FORM_SetIndexSelected = f("FORM_SetIndexSelected", 4), e._FORM_IsIndexSelected = f("FORM_IsIndexSelected", 3), e._FPDFDoc_GetJavaScriptActionCount = f("FPDFDoc_GetJavaScriptActionCount", 1), e._FPDFDoc_GetJavaScriptAction = f("FPDFDoc_GetJavaScriptAction", 2), e._FPDFDoc_CloseJavaScriptAction = f("FPDFDoc_CloseJavaScriptAction", 1), e._FPDFJavaScriptAction_GetName = f("FPDFJavaScriptAction_GetName", 3), e._FPDFJavaScriptAction_GetScript = f("FPDFJavaScriptAction_GetScript", 3), e._FPDF_ImportPagesByIndex = f("FPDF_ImportPagesByIndex", 5), e._FPDF_ImportPages = f("FPDF_ImportPages", 4), e._FPDF_ImportNPagesToOne = f("FPDF_ImportNPagesToOne", 5), e._FPDF_NewXObjectFromPage = f("FPDF_NewXObjectFromPage", 3), e._FPDF_CloseXObject = f("FPDF_CloseXObject", 1), e._FPDF_NewFormObjectFromXObject = f("FPDF_NewFormObjectFromXObject", 1), e._FPDF_CopyViewerPreferences = f("FPDF_CopyViewerPreferences", 2), e._FPDF_RenderPageBitmapWithColorScheme_Start = f("FPDF_RenderPageBitmapWithColorScheme_Start", 10), e._FPDF_RenderPageBitmap_Start = f("FPDF_RenderPageBitmap_Start", 9), e._FPDF_RenderPage_Continue = f("FPDF_RenderPage_Continue", 2), e._FPDF_RenderPage_Close = f("FPDF_RenderPage_Close", 1), e._FPDF_SaveWithVersion = f("FPDF_SaveWithVersion", 4), e._FPDFText_GetCharIndexFromTextIndex = f("FPDFText_GetCharIndexFromTextIndex", 2), e._FPDFText_GetTextIndexFromCharIndex = f("FPDFText_GetTextIndexFromCharIndex", 2), e._FPDF_GetSignatureCount = f("FPDF_GetSignatureCount", 1), e._FPDF_GetSignatureObject = f("FPDF_GetSignatureObject", 2), e._FPDFSignatureObj_GetContents = f("FPDFSignatureObj_GetContents", 3), e._FPDFSignatureObj_GetByteRange = f("FPDFSignatureObj_GetByteRange", 3), e._FPDFSignatureObj_GetSubFilter = f("FPDFSignatureObj_GetSubFilter", 3), e._FPDFSignatureObj_GetReason = f("FPDFSignatureObj_GetReason", 3), e._FPDFSignatureObj_GetTime = f("FPDFSignatureObj_GetTime", 3), e._FPDFSignatureObj_GetDocMDPPermission = f("FPDFSignatureObj_GetDocMDPPermission", 1), e._FPDF_StructTree_GetForPage = f("FPDF_StructTree_GetForPage", 1), e._FPDF_StructTree_Close = f("FPDF_StructTree_Close", 1), e._FPDF_StructTree_CountChildren = f("FPDF_StructTree_CountChildren", 1), e._FPDF_StructTree_GetChildAtIndex = f("FPDF_StructTree_GetChildAtIndex", 2), e._FPDF_StructElement_GetAltText = f("FPDF_StructElement_GetAltText", 3), e._FPDF_StructElement_GetActualText = f("FPDF_StructElement_GetActualText", 3), e._FPDF_StructElement_GetID = f("FPDF_StructElement_GetID", 3), e._FPDF_StructElement_GetLang = f("FPDF_StructElement_GetLang", 3), e._FPDF_StructElement_GetAttributeCount = f("FPDF_StructElement_GetAttributeCount", 1), e._FPDF_StructElement_GetAttributeAtIndex = f("FPDF_StructElement_GetAttributeAtIndex", 2), e._FPDF_StructElement_GetStringAttribute = f("FPDF_StructElement_GetStringAttribute", 4), e._FPDF_StructElement_GetMarkedContentID = f("FPDF_StructElement_GetMarkedContentID", 1), e._FPDF_StructElement_GetType = f("FPDF_StructElement_GetType", 3), e._FPDF_StructElement_GetObjType = f("FPDF_StructElement_GetObjType", 3), e._FPDF_StructElement_GetTitle = f("FPDF_StructElement_GetTitle", 3), e._FPDF_StructElement_CountChildren = f("FPDF_StructElement_CountChildren", 1), e._FPDF_StructElement_GetChildAtIndex = f("FPDF_StructElement_GetChildAtIndex", 2), e._FPDF_StructElement_GetChildMarkedContentID = f("FPDF_StructElement_GetChildMarkedContentID", 2), e._FPDF_StructElement_GetParent = f("FPDF_StructElement_GetParent", 1), e._FPDF_StructElement_Attr_GetCount = f("FPDF_StructElement_Attr_GetCount", 1), e._FPDF_StructElement_Attr_GetName = f("FPDF_StructElement_Attr_GetName", 5), e._FPDF_StructElement_Attr_GetValue = f("FPDF_StructElement_Attr_GetValue", 2), e._FPDF_StructElement_Attr_GetType = f("FPDF_StructElement_Attr_GetType", 1), e._FPDF_StructElement_Attr_GetBooleanValue = f("FPDF_StructElement_Attr_GetBooleanValue", 2), e._FPDF_StructElement_Attr_GetNumberValue = f("FPDF_StructElement_Attr_GetNumberValue", 2), e._FPDF_StructElement_Attr_GetStringValue = f("FPDF_StructElement_Attr_GetStringValue", 4), e._FPDF_StructElement_Attr_GetBlobValue = f("FPDF_StructElement_Attr_GetBlobValue", 4), e._FPDF_StructElement_Attr_CountChildren = f("FPDF_StructElement_Attr_CountChildren", 1), e._FPDF_StructElement_Attr_GetChildAtIndex = f("FPDF_StructElement_Attr_GetChildAtIndex", 2), e._FPDF_StructElement_GetMarkedContentIdCount = f("FPDF_StructElement_GetMarkedContentIdCount", 1), e._FPDF_StructElement_GetMarkedContentIdAtIndex = f("FPDF_StructElement_GetMarkedContentIdAtIndex", 2), e._FPDF_AddInstalledFont = f("FPDF_AddInstalledFont", 3), e._FPDF_SetSystemFontInfo = f("FPDF_SetSystemFontInfo", 1), e._FPDF_GetDefaultTTFMap = f("FPDF_GetDefaultTTFMap", 0), e._FPDF_GetDefaultTTFMapCount = f("FPDF_GetDefaultTTFMapCount", 0), e._FPDF_GetDefaultTTFMapEntry = f("FPDF_GetDefaultTTFMapEntry", 1), e._FPDF_GetDefaultSystemFontInfo = f("FPDF_GetDefaultSystemFontInfo", 0), e._FPDF_FreeDefaultSystemFontInfo = f("FPDF_FreeDefaultSystemFontInfo", 1), e._FPDFText_LoadPage = f("FPDFText_LoadPage", 1), e._FPDFText_ClosePage = f("FPDFText_ClosePage", 1), e._FPDFText_CountChars = f("FPDFText_CountChars", 1), e._FPDFText_GetUnicode = f("FPDFText_GetUnicode", 2), e._FPDFText_GetTextObject = f("FPDFText_GetTextObject", 2), e._FPDFText_IsGenerated = f("FPDFText_IsGenerated", 2), e._FPDFText_IsHyphen = f("FPDFText_IsHyphen", 2), e._FPDFText_HasUnicodeMapError = f("FPDFText_HasUnicodeMapError", 2), e._FPDFText_GetFontSize = f("FPDFText_GetFontSize", 2), e._FPDFText_GetFontInfo = f("FPDFText_GetFontInfo", 5), e._FPDFText_GetFontWeight = f("FPDFText_GetFontWeight", 2), e._FPDFText_GetFillColor = f("FPDFText_GetFillColor", 6), e._FPDFText_GetStrokeColor = f("FPDFText_GetStrokeColor", 6), e._FPDFText_GetCharAngle = f("FPDFText_GetCharAngle", 2), e._FPDFText_GetCharBox = f("FPDFText_GetCharBox", 6), e._FPDFText_GetLooseCharBox = f("FPDFText_GetLooseCharBox", 3), e._FPDFText_GetMatrix = f("FPDFText_GetMatrix", 3), e._FPDFText_GetCharOrigin = f("FPDFText_GetCharOrigin", 4), e._FPDFText_GetCharIndexAtPos = f("FPDFText_GetCharIndexAtPos", 5), e._FPDFText_GetText = f("FPDFText_GetText", 4), e._FPDFText_CountRects = f("FPDFText_CountRects", 3), e._FPDFText_GetRect = f("FPDFText_GetRect", 6), e._FPDFText_GetBoundedText = f("FPDFText_GetBoundedText", 7), e._FPDFText_FindStart = f("FPDFText_FindStart", 4), e._FPDFText_FindNext = f("FPDFText_FindNext", 1), e._FPDFText_FindPrev = f("FPDFText_FindPrev", 1), e._FPDFText_GetSchResultIndex = f("FPDFText_GetSchResultIndex", 1), e._FPDFText_GetSchCount = f("FPDFText_GetSchCount", 1), e._FPDFText_FindClose = f("FPDFText_FindClose", 1), e._FPDFLink_LoadWebLinks = f("FPDFLink_LoadWebLinks", 1), e._FPDFLink_CountWebLinks = f("FPDFLink_CountWebLinks", 1), e._FPDFLink_GetURL = f("FPDFLink_GetURL", 4), e._FPDFLink_CountRects = f("FPDFLink_CountRects", 2), e._FPDFLink_GetRect = f("FPDFLink_GetRect", 7), e._FPDFLink_GetTextRange = f("FPDFLink_GetTextRange", 4), e._FPDFLink_CloseWebLinks = f("FPDFLink_CloseWebLinks", 1), e._FPDFPage_GetDecodedThumbnailData = f("FPDFPage_GetDecodedThumbnailData", 3), e._FPDFPage_GetRawThumbnailData = f("FPDFPage_GetRawThumbnailData", 3), e._FPDFPage_GetThumbnailAsBitmap = f("FPDFPage_GetThumbnailAsBitmap", 1), e._FPDFPage_SetMediaBox = f("FPDFPage_SetMediaBox", 5), e._FPDFPage_SetCropBox = f("FPDFPage_SetCropBox", 5), e._FPDFPage_SetBleedBox = f("FPDFPage_SetBleedBox", 5), e._FPDFPage_SetTrimBox = f("FPDFPage_SetTrimBox", 5), e._FPDFPage_SetArtBox = f("FPDFPage_SetArtBox", 5), e._FPDFPage_GetMediaBox = f("FPDFPage_GetMediaBox", 5), e._FPDFPage_GetCropBox = f("FPDFPage_GetCropBox", 5), e._FPDFPage_GetBleedBox = f("FPDFPage_GetBleedBox", 5), e._FPDFPage_GetTrimBox = f("FPDFPage_GetTrimBox", 5), e._FPDFPage_GetArtBox = f("FPDFPage_GetArtBox", 5), e._FPDFPage_TransFormWithClip = f("FPDFPage_TransFormWithClip", 3), e._FPDFPageObj_TransformClipPath = f("FPDFPageObj_TransformClipPath", 7), e._FPDFPageObj_GetClipPath = f("FPDFPageObj_GetClipPath", 1), e._FPDFClipPath_CountPaths = f("FPDFClipPath_CountPaths", 1), e._FPDFClipPath_CountPathSegments = f("FPDFClipPath_CountPathSegments", 2), e._FPDFClipPath_GetPathSegment = f("FPDFClipPath_GetPathSegment", 3), e._FPDF_CreateClipPath = f("FPDF_CreateClipPath", 4), e._FPDF_DestroyClipPath = f("FPDF_DestroyClipPath", 1), e._FPDFPage_InsertClipPath = f("FPDFPage_InsertClipPath", 2), e._FPDF_InitLibrary = f("FPDF_InitLibrary", 0), e._FPDF_DestroyLibrary = f("FPDF_DestroyLibrary", 0), e._FPDF_SetSandBoxPolicy = f("FPDF_SetSandBoxPolicy", 2), e._FPDF_LoadDocument = f("FPDF_LoadDocument", 2), e._FPDF_GetFormType = f("FPDF_GetFormType", 1), e._FPDF_LoadXFA = f("FPDF_LoadXFA", 1), e._FPDF_LoadMemDocument = f("FPDF_LoadMemDocument", 3), e._FPDF_LoadMemDocument64 = f("FPDF_LoadMemDocument64", 3), e._FPDF_LoadCustomDocument = f("FPDF_LoadCustomDocument", 2), e._FPDF_GetFileVersion = f("FPDF_GetFileVersion", 2), e._FPDF_DocumentHasValidCrossReferenceTable = f("FPDF_DocumentHasValidCrossReferenceTable", 1), e._FPDF_GetDocPermissions = f("FPDF_GetDocPermissions", 1), e._FPDF_GetDocUserPermissions = f("FPDF_GetDocUserPermissions", 1), e._FPDF_GetSecurityHandlerRevision = f("FPDF_GetSecurityHandlerRevision", 1), e._EPDF_SetEncryption = f("EPDF_SetEncryption", 4), e._EPDF_RemoveEncryption = f("EPDF_RemoveEncryption", 1), e._EPDF_UnlockOwnerPermissions = f("EPDF_UnlockOwnerPermissions", 2), e._EPDF_IsEncrypted = f("EPDF_IsEncrypted", 1), e._EPDF_IsOwnerUnlocked = f("EPDF_IsOwnerUnlocked", 1), e._FPDF_GetPageCount = f("FPDF_GetPageCount", 1), e._FPDF_LoadPage = f("FPDF_LoadPage", 2), e._EPDFDoc_LoadPageByObjectNumber = f("EPDFDoc_LoadPageByObjectNumber", 2), e._EPDFDoc_GetPageObjectNumberByIndex = f("EPDFDoc_GetPageObjectNumberByIndex", 2), e._EPDFPage_GetObjectNumber = f("EPDFPage_GetObjectNumber", 1), e._FPDF_GetPageWidthF = f("FPDF_GetPageWidthF", 1), e._FPDF_GetPageWidth = f("FPDF_GetPageWidth", 1), e._FPDF_GetPageHeightF = f("FPDF_GetPageHeightF", 1), e._FPDF_GetPageHeight = f("FPDF_GetPageHeight", 1), e._FPDF_GetPageBoundingBox = f("FPDF_GetPageBoundingBox", 2), e._FPDF_RenderPageBitmap = f("FPDF_RenderPageBitmap", 8), e._FPDF_RenderPageBitmapWithMatrix = f("FPDF_RenderPageBitmapWithMatrix", 5), e._EPDF_RenderAnnotBitmap = f("EPDF_RenderAnnotBitmap", 6), e._EPDF_RenderAnnotBitmapUnrotated = f("EPDF_RenderAnnotBitmapUnrotated", 6), e._FPDF_ClosePage = f("FPDF_ClosePage", 1), e._FPDF_CloseDocument = f("FPDF_CloseDocument", 1), e._FPDF_GetLastError = f("FPDF_GetLastError", 0), e._FPDF_DeviceToPage = f("FPDF_DeviceToPage", 10), e._FPDF_PageToDevice = f("FPDF_PageToDevice", 10), e._FPDFBitmap_Create = f("FPDFBitmap_Create", 3), e._FPDFBitmap_CreateEx = f("FPDFBitmap_CreateEx", 5), e._FPDFBitmap_GetFormat = f("FPDFBitmap_GetFormat", 1), e._FPDFBitmap_FillRect = f("FPDFBitmap_FillRect", 6), e._FPDFBitmap_GetBuffer = f("FPDFBitmap_GetBuffer", 1), e._FPDFBitmap_GetWidth = f("FPDFBitmap_GetWidth", 1), e._FPDFBitmap_GetHeight = f("FPDFBitmap_GetHeight", 1), e._FPDFBitmap_GetStride = f("FPDFBitmap_GetStride", 1), e._FPDFBitmap_Destroy = f("FPDFBitmap_Destroy", 1), e._FPDF_GetPageSizeByIndexF = f("FPDF_GetPageSizeByIndexF", 3), e._EPDF_GetPageRotationByIndex = f("EPDF_GetPageRotationByIndex", 2), e._EPDF_GetPageBoxByIndex = f("EPDF_GetPageBoxByIndex", 4), e._EPDF_GetPageSizeByIndexNormalized = f("EPDF_GetPageSizeByIndexNormalized", 3), e._EPDF_LoadPageNormalized = f("EPDF_LoadPageNormalized", 3), e._FPDF_GetPageSizeByIndex = f("FPDF_GetPageSizeByIndex", 4), e._FPDF_VIEWERREF_GetPrintScaling = f("FPDF_VIEWERREF_GetPrintScaling", 1), e._FPDF_VIEWERREF_GetNumCopies = f("FPDF_VIEWERREF_GetNumCopies", 1), e._FPDF_VIEWERREF_GetPrintPageRange = f("FPDF_VIEWERREF_GetPrintPageRange", 1), e._FPDF_VIEWERREF_GetPrintPageRangeCount = f("FPDF_VIEWERREF_GetPrintPageRangeCount", 1), e._FPDF_VIEWERREF_GetPrintPageRangeElement = f("FPDF_VIEWERREF_GetPrintPageRangeElement", 2), e._FPDF_VIEWERREF_GetDuplex = f("FPDF_VIEWERREF_GetDuplex", 1), e._FPDF_VIEWERREF_GetName = f("FPDF_VIEWERREF_GetName", 4), e._FPDF_CountNamedDests = f("FPDF_CountNamedDests", 1), e._FPDF_GetNamedDestByName = f("FPDF_GetNamedDestByName", 2), e._FPDF_GetNamedDest = f("FPDF_GetNamedDest", 4), e._FPDF_GetXFAPacketCount = f("FPDF_GetXFAPacketCount", 1), e._FPDF_GetXFAPacketName = f("FPDF_GetXFAPacketName", 4), e._FPDF_GetXFAPacketContent = f("FPDF_GetXFAPacketContent", 5), e._FPDF_GetTrailerEnds = f("FPDF_GetTrailerEnds", 3);
    var Pi = f("strerror", 1), Di = f("fflush", 1), yi = f("emscripten_builtin_memalign", 2), jt = f("setThrew", 2), Uo = () => (Uo = Pt.emscripten_stack_init)(), Hr = () => (Hr = Pt.emscripten_stack_get_end)(), zo = (c) => (zo = Pt._emscripten_stack_restore)(c), Ho = (c) => (Ho = Pt._emscripten_stack_alloc)(c), Wo = () => (Wo = Pt.emscripten_stack_get_current)();
    e.dynCall_j = f("dynCall_j", 1), e.dynCall_ji = f("dynCall_ji", 2), e.dynCall_iiij = f("dynCall_iiij", 5), e.dynCall_jji = f("dynCall_jji", 4), e.dynCall_iji = f("dynCall_iji", 4), e.dynCall_viijii = f("dynCall_viijii", 7), e.dynCall_jij = f("dynCall_jij", 4), e.dynCall_iij = f("dynCall_iij", 4), e.dynCall_iiji = f("dynCall_iiji", 5), e.dynCall_jiji = f("dynCall_jiji", 5), e.dynCall_iiiiij = f("dynCall_iiiiij", 7), e.dynCall_iiiiijj = f("dynCall_iiiiijj", 9), e.dynCall_iiiiiijj = f("dynCall_iiiiiijj", 10), e.dynCall_viji = f("dynCall_viji", 5);
    function wi(c, d, b, v) {
      var C = ut();
      try {
        kt(c)(d, b, v);
      } catch (T) {
        if (rt(C), T !== T + 0) throw T;
        jt(1, 0);
      }
    }
    function vi(c, d) {
      var b = ut();
      try {
        return kt(c)(d);
      } catch (v) {
        if (rt(b), v !== v + 0) throw v;
        jt(1, 0);
      }
    }
    function xi(c, d, b) {
      var v = ut();
      try {
        return kt(c)(d, b);
      } catch (C) {
        if (rt(v), C !== C + 0) throw C;
        jt(1, 0);
      }
    }
    function Ai(c, d, b, v) {
      var C = ut();
      try {
        return kt(c)(d, b, v);
      } catch (T) {
        if (rt(C), T !== T + 0) throw T;
        jt(1, 0);
      }
    }
    function ki(c, d, b, v, C) {
      var T = ut();
      try {
        return kt(c)(d, b, v, C);
      } catch (U) {
        if (rt(T), U !== U + 0) throw U;
        jt(1, 0);
      }
    }
    function Ei(c, d, b) {
      var v = ut();
      try {
        kt(c)(d, b);
      } catch (C) {
        if (rt(v), C !== C + 0) throw C;
        jt(1, 0);
      }
    }
    function Si(c, d) {
      var b = ut();
      try {
        kt(c)(d);
      } catch (v) {
        if (rt(b), v !== v + 0) throw v;
        jt(1, 0);
      }
    }
    function Ci(c) {
      var d = ut();
      try {
        kt(c)();
      } catch (b) {
        if (rt(d), b !== b + 0) throw b;
        jt(1, 0);
      }
    }
    function Mi(c, d, b, v, C) {
      var T = ut();
      try {
        kt(c)(d, b, v, C);
      } catch (U) {
        if (rt(T), U !== U + 0) throw U;
        jt(1, 0);
      }
    }
    function Gi(c, d, b, v, C, T, U, X, le, Pe) {
      var xe = ut();
      try {
        kt(c)(d, b, v, C, T, U, X, le, Pe);
      } catch (Se) {
        if (rt(xe), Se !== Se + 0) throw Se;
        jt(1, 0);
      }
    }
    e.wasmExports = Pt, e.ccall = No, e.cwrap = pi, e.addFunction = di, e.removeFunction = Fi, e.setValue = en, e.getValue = un, e.UTF8ToString = xt, e.stringToUTF8 = me, e.UTF16ToString = ai, e.stringToUTF16 = gi;
    var Ti = ["writeI53ToI64", "writeI53ToI64Clamped", "writeI53ToI64Signaling", "writeI53ToU64Clamped", "writeI53ToU64Signaling", "readI53FromI64", "readI53FromU64", "convertI32PairToI53", "convertU32PairToI53", "getTempRet0", "setTempRet0", "exitJS", "inetPton4", "inetNtop4", "inetPton6", "inetNtop6", "readSockaddr", "writeSockaddr", "emscriptenLog", "readEmAsmArgs", "jstoi_q", "listenOnce", "autoResumeAudioContext", "dynCallLegacy", "getDynCaller", "dynCall", "handleException", "keepRuntimeAlive", "runtimeKeepalivePush", "runtimeKeepalivePop", "callUserCallback", "maybeExit", "asmjsMangle", "HandleAllocator", "getNativeTypeSize", "STACK_SIZE", "STACK_ALIGN", "POINTER_SIZE", "ASSERTIONS", "reallyNegative", "unSign", "strLen", "reSign", "formatString", "intArrayToString", "AsciiToString", "lengthBytesUTF16", "UTF32ToString", "stringToUTF32", "lengthBytesUTF32", "stringToNewUTF8", "registerKeyEventCallback", "maybeCStringToJsString", "findEventTarget", "getBoundingClientRect", "fillMouseEventData", "registerMouseEventCallback", "registerWheelEventCallback", "registerUiEventCallback", "registerFocusEventCallback", "fillDeviceOrientationEventData", "registerDeviceOrientationEventCallback", "fillDeviceMotionEventData", "registerDeviceMotionEventCallback", "screenOrientation", "fillOrientationChangeEventData", "registerOrientationChangeEventCallback", "fillFullscreenChangeEventData", "registerFullscreenChangeEventCallback", "JSEvents_requestFullscreen", "JSEvents_resizeCanvasForFullscreen", "registerRestoreOldStyle", "hideEverythingExceptGivenElement", "restoreHiddenElements", "setLetterbox", "softFullscreenResizeWebGLRenderTarget", "doRequestFullscreen", "fillPointerlockChangeEventData", "registerPointerlockChangeEventCallback", "registerPointerlockErrorEventCallback", "requestPointerLock", "fillVisibilityChangeEventData", "registerVisibilityChangeEventCallback", "registerTouchEventCallback", "fillGamepadEventData", "registerGamepadEventCallback", "registerBeforeUnloadEventCallback", "fillBatteryEventData", "battery", "registerBatteryEventCallback", "setCanvasElementSize", "getCanvasElementSize", "jsStackTrace", "getCallstack", "convertPCtoSourceLocation", "checkWasiClock", "wasiRightsToMuslOFlags", "wasiOFlagsToMuslOFlags", "createDyncallWrapper", "safeSetTimeout", "setImmediateWrapped", "clearImmediateWrapped", "polyfillSetImmediate", "registerPostMainLoop", "registerPreMainLoop", "getPromise", "makePromise", "idsToPromises", "makePromiseCallback", "ExceptionInfo", "findMatchingCatch", "Browser_asyncPrepareDataCounter", "safeRequestAnimationFrame", "arraySum", "addDays", "getSocketFromFD", "getSocketAddress", "FS_unlink", "FS_mkdirTree", "_setNetworkCallback", "heapObjectForWebGLType", "toTypedArrayIndex", "webgl_enable_ANGLE_instanced_arrays", "webgl_enable_OES_vertex_array_object", "webgl_enable_WEBGL_draw_buffers", "webgl_enable_WEBGL_multi_draw", "webgl_enable_EXT_polygon_offset_clamp", "webgl_enable_EXT_clip_control", "webgl_enable_WEBGL_polygon_mode", "emscriptenWebGLGet", "computeUnpackAlignedImageSize", "colorChannelsInGlTextureFormat", "emscriptenWebGLGetTexPixelData", "emscriptenWebGLGetUniform", "webglGetUniformLocation", "webglPrepareUniformLocationsBeforeFirstUse", "webglGetLeftBracePos", "emscriptenWebGLGetVertexAttrib", "__glGetActiveAttribOrUniform", "writeGLArray", "registerWebGlEventCallback", "runAndAbortIfError", "ALLOC_NORMAL", "ALLOC_STACK", "allocate", "writeStringToMemory", "writeAsciiToMemory", "setErrNo", "demangle", "stackTrace"];
    Ti.forEach(xn);
    var Oi = ["run", "addOnPreRun", "addOnInit", "addOnPreMain", "addOnExit", "addOnPostRun", "addRunDependency", "removeRunDependency", "out", "err", "callMain", "abort", "wasmMemory", "writeStackCookie", "checkStackCookie", "convertI32PairToI53Checked", "stackSave", "stackRestore", "stackAlloc", "ptrToString", "zeroMemory", "getHeapMax", "growMemory", "ENV", "ERRNO_CODES", "strError", "DNS", "Protocols", "Sockets", "initRandomFill", "randomFill", "timers", "warnOnce", "readEmAsmArgsArray", "jstoi_s", "getExecutableName", "asyncLoad", "alignMemory", "mmapAlloc", "wasmTable", "noExitRuntime", "getCFunc", "uleb128Encode", "sigToWasmTypes", "generateFuncType", "convertJsFunctionToWasm", "freeTableIndexes", "functionsInTableMap", "getEmptyTableSlot", "updateTableMap", "getFunctionAddress", "PATH", "PATH_FS", "UTF8Decoder", "UTF8ArrayToString", "stringToUTF8Array", "lengthBytesUTF8", "intArrayFromString", "stringToAscii", "UTF16Decoder", "stringToUTF8OnStack", "writeArrayToMemory", "JSEvents", "specialHTMLTargets", "findCanvasEventTarget", "currentFullscreenStrategy", "restoreOldWindowedStyle", "UNWIND_CACHE", "ExitStatus", "getEnvStrings", "doReadv", "doWritev", "promiseMap", "uncaughtExceptionCount", "exceptionLast", "exceptionCaught", "Browser", "getPreloadedImageData__data", "wget", "MONTH_DAYS_REGULAR", "MONTH_DAYS_LEAP", "MONTH_DAYS_REGULAR_CUMULATIVE", "MONTH_DAYS_LEAP_CUMULATIVE", "isLeapYear", "ydayFromDate", "SYSCALLS", "preloadPlugins", "FS_createPreloadedFile", "FS_modeStringToFlags", "FS_getMode", "FS_stdin_getChar_buffer", "FS_stdin_getChar", "FS_createPath", "FS_createDevice", "FS_readFile", "FS", "FS_createDataFile", "FS_createLazyFile", "MEMFS", "TTY", "PIPEFS", "SOCKFS", "tempFixedLengthArray", "miniTempWebGLFloatBuffers", "miniTempWebGLIntBuffers", "GL", "AL", "GLUT", "EGL", "GLEW", "IDBStore", "SDL", "SDL_gfx", "allocateUTF8", "allocateUTF8OnStack", "print", "printErr"];
    Oi.forEach(ct);
    var fr, Vo;
    Ke = function c() {
      fr || Ko(), fr || (Ke = c);
    };
    function Ri() {
      Uo(), J();
    }
    function Ko() {
      if (Ee > 0 || (Ri(), !Vo && (Vo = 1, we(), Ee > 0))) return;
      function c() {
        fr || (fr = 1, e.calledRun = 1, !G && (ce(), r(e), e.onRuntimeInitialized?.(), E(!e._main, 'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]'), Ge()));
      }
      e.setStatus ? (e.setStatus("Running..."), setTimeout(() => {
        setTimeout(() => e.setStatus(""), 1), c();
      }, 1)) : c(), ee();
    }
    if (e.preInit) for (typeof e.preInit == "function" && (e.preInit = [e.preInit]); e.preInit.length > 0; ) e.preInit.pop()();
    Ko(), t = a;
    for (const c of Object.keys(e)) c in n || Object.defineProperty(n, c, { configurable: true, get() {
      Le(`Access to module property ('${c}') is no longer possible via the module constructor argument; Instead, use the result of the module constructor.`);
    } });
    return t;
  });
})();
const Wr = { EPDF_GetMetaKeyCount: [["number", "boolean"], "number"], EPDF_GetMetaKeyName: [["number", "number", "boolean", "number", "number"], "number"], EPDF_GetMetaTrapped: [["number"], "number"], EPDF_GetPageBoxByIndex: [["number", "number", "number", "number"], "boolean"], EPDF_GetPageRotationByIndex: [["number", "number"], "number"], EPDF_GetPageSizeByIndexNormalized: [["number", "number", "number"], "boolean"], EPDF_HasMetaText: [["number", "string"], "boolean"], EPDF_IsEncrypted: [["number"], "boolean"], EPDF_IsOwnerUnlocked: [["number"], "boolean"], EPDF_LoadPageNormalized: [["number", "number", "number"], "number"], EPDF_PNG_EncodeRGBA: [["number", "number", "number", "number", "number", "number"], "number"], EPDF_RemoveEncryption: [["number"], "boolean"], EPDF_RenderAnnotBitmap: [["number", "number", "number", "number", "number", "number"], "boolean"], EPDF_RenderAnnotBitmapUnrotated: [["number", "number", "number", "number", "number", "number"], "boolean"], EPDF_SetEncryption: [["number", "string", "string", "number"], "boolean"], EPDF_SetMetaText: [["number", "string", "number"], "boolean"], EPDF_SetMetaTrapped: [["number", "number"], "boolean"], EPDF_UnlockOwnerPermissions: [["number", "string"], "boolean"], EPDFAction_CreateGoTo: [["number", "number"], "number"], EPDFAction_CreateGoToNamed: [["number", "string"], "number"], EPDFAction_CreateLaunch: [["number", "number"], "number"], EPDFAction_CreateRemoteGoToByName: [["number", "number", "number"], "number"], EPDFAction_CreateRemoteGoToDest: [["number", "number", "number"], "number"], EPDFAction_CreateURI: [["number", "string"], "number"], EPDFAnnot_ApplyRedaction: [["number", "number"], "boolean"], EPDFAnnot_ClearBorderEffect: [["number"], "boolean"], EPDFAnnot_ClearColor: [["number", "number"], "boolean"], EPDFAnnot_ClearMKColor: [["number", "number"], "boolean"], EPDFAnnot_ClearRectangleDifferences: [["number"], "boolean"], EPDFAnnot_ExportAppearanceAsDocument: [["number"], "number"], EPDFAnnot_ExportMultipleAppearancesAsDocument: [["number", "number"], "number"], EPDFAnnot_Flatten: [["number", "number"], "boolean"], EPDFAnnot_GenerateAppearance: [["number"], "boolean"], EPDFAnnot_GenerateAppearanceWithBlend: [["number", "number"], "boolean"], EPDFAnnot_GenerateFormFieldAP: [["number"], "boolean"], EPDFAnnot_GetAPMatrix: [["number", "number", "number"], "boolean"], EPDFAnnot_GetAvailableAppearanceModes: [["number"], "number"], EPDFAnnot_GetBlendMode: [["number"], "number"], EPDFAnnot_GetBorderDashPattern: [["number", "number", "number"], "boolean"], EPDFAnnot_GetBorderDashPatternCount: [["number"], "number"], EPDFAnnot_GetBorderEffect: [["number", "number"], "boolean"], EPDFAnnot_GetBorderStyle: [["number", "number"], "number"], EPDFAnnot_GetButtonExportValue: [["number", "number", "number"], "number"], EPDFAnnot_GetCalloutLine: [["number", "number", "number"], "number"], EPDFAnnot_GetCalloutLineCount: [["number"], "number"], EPDFAnnot_GetColor: [["number", "number", "number", "number", "number"], "boolean"], EPDFAnnot_GetDefaultAppearance: [["number", "number", "number", "number", "number", "number"], "boolean"], EPDFAnnot_GetExtendedRotation: [["number", "number"], "boolean"], EPDFAnnot_GetFormFieldObjectNumber: [["number", "number"], "number"], EPDFAnnot_GetFormFieldRawValue: [["number", "number", "number", "number"], "number"], EPDFAnnot_GetIntent: [["number", "number", "number"], "number"], EPDFAnnot_GetLineEndings: [["number", "number", "number"], "boolean"], EPDFAnnot_GetMKColor: [["number", "number", "number", "number", "number"], "boolean"], EPDFAnnot_GetName: [["number"], "number"], EPDFAnnot_GetObjectNumber: [["number"], "number"], EPDFAnnot_GetOpacity: [["number", "number"], "boolean"], EPDFAnnot_GetOverlayText: [["number", "number", "number"], "number"], EPDFAnnot_GetOverlayTextRepeat: [["number"], "boolean"], EPDFAnnot_GetRect: [["number", "number"], "boolean"], EPDFAnnot_GetRectangleDifferences: [["number", "number", "number", "number", "number"], "boolean"], EPDFAnnot_GetReplyType: [["number"], "number"], EPDFAnnot_GetRichContent: [["number", "number", "number"], "number"], EPDFAnnot_GetRotate: [["number", "number"], "boolean"], EPDFAnnot_GetTextAlignment: [["number"], "number"], EPDFAnnot_GetUnrotatedRect: [["number", "number"], "boolean"], EPDFAnnot_GetVerticalAlignment: [["number"], "number"], EPDFAnnot_HasAppearanceStream: [["number", "number"], "boolean"], EPDFAnnot_SetAction: [["number", "number"], "boolean"], EPDFAnnot_SetAPMatrix: [["number", "number", "number"], "boolean"], EPDFAnnot_SetAppearanceFromPage: [["number", "number", "number"], "boolean"], EPDFAnnot_SetBorderDashPattern: [["number", "number", "number"], "boolean"], EPDFAnnot_SetBorderEffect: [["number", "number"], "boolean"], EPDFAnnot_SetBorderStyle: [["number", "number", "number"], "boolean"], EPDFAnnot_SetCalloutLine: [["number", "number", "number"], "boolean"], EPDFAnnot_SetColor: [["number", "number", "number", "number", "number"], "boolean"], EPDFAnnot_SetDefaultAppearance: [["number", "number", "number", "number", "number", "number"], "boolean"], EPDFAnnot_SetExtendedRotation: [["number", "number"], "boolean"], EPDFAnnot_SetFormFieldName: [["number", "number", "number"], "boolean"], EPDFAnnot_SetFormFieldOptions: [["number", "number", "number", "number"], "boolean"], EPDFAnnot_SetFormFieldValue: [["number", "number", "number"], "boolean"], EPDFAnnot_SetIntent: [["number", "string"], "boolean"], EPDFAnnot_SetLine: [["number", "number", "number"], "boolean"], EPDFAnnot_SetLineEndings: [["number", "number", "number"], "boolean"], EPDFAnnot_SetLinkedAnnot: [["number", "string", "number"], "boolean"], EPDFAnnot_SetMKColor: [["number", "number", "number", "number", "number"], "boolean"], EPDFAnnot_SetName: [["number", "number"], "boolean"], EPDFAnnot_SetNumberValue: [["number", "string", "number"], "boolean"], EPDFAnnot_SetOpacity: [["number", "number"], "boolean"], EPDFAnnot_SetOverlayText: [["number", "number"], "boolean"], EPDFAnnot_SetOverlayTextRepeat: [["number", "boolean"], "boolean"], EPDFAnnot_SetRectangleDifferences: [["number", "number", "number", "number", "number"], "boolean"], EPDFAnnot_SetReplyType: [["number", "number"], "boolean"], EPDFAnnot_SetRotate: [["number", "number"], "boolean"], EPDFAnnot_SetTextAlignment: [["number", "number"], "boolean"], EPDFAnnot_SetUnrotatedRect: [["number", "number"], "boolean"], EPDFAnnot_SetVerticalAlignment: [["number", "number"], "boolean"], EPDFAnnot_SetVertices: [["number", "number", "number"], "boolean"], EPDFAnnot_ShareFormField: [["number", "number", "number"], "boolean"], EPDFAnnot_UpdateAppearanceToRect: [["number", "number"], "boolean"], EPDFAttachment_GetDescription: [["number", "number", "number"], "number"], EPDFAttachment_GetIntegerValue: [["number", "string", "number"], "boolean"], EPDFAttachment_SetDescription: [["number", "number"], "boolean"], EPDFAttachment_SetSubtype: [["number", "string"], "boolean"], EPDFBookmark_AppendChild: [["number", "number", "number"], "number"], EPDFBookmark_Clear: [["number"], "boolean"], EPDFBookmark_ClearTarget: [["number"], "boolean"], EPDFBookmark_Create: [["number", "number"], "number"], EPDFBookmark_Delete: [["number", "number"], "boolean"], EPDFBookmark_InsertAfter: [["number", "number", "number", "number"], "number"], EPDFBookmark_SetAction: [["number", "number", "number"], "boolean"], EPDFBookmark_SetDest: [["number", "number", "number"], "boolean"], EPDFBookmark_SetTitle: [["number", "number"], "boolean"], EPDFCatalog_GetLanguage: [["number", "number", "number"], "number"], EPDFDest_CreateRemoteView: [["number", "number", "number", "number", "number"], "number"], EPDFDest_CreateRemoteXYZ: [["number", "number", "boolean", "number", "boolean", "number", "boolean", "number"], "number"], EPDFDest_CreateView: [["number", "number", "number", "number"], "number"], EPDFDest_CreateXYZ: [["number", "boolean", "number", "boolean", "number", "boolean", "number"], "number"], EPDFDoc_GetPageObjectNumberByIndex: [["number", "number"], "number"], EPDFDoc_LoadPageByObjectNumber: [["number", "number"], "number"], EPDFImageObj_SetJpeg: [["number", "number", "number", "number", "number"], "boolean"], EPDFImageObj_SetPng: [["number", "number", "number", "number", "number"], "boolean"], EPDFNamedDest_Remove: [["number", "string"], "boolean"], EPDFNamedDest_SetDest: [["number", "string", "number"], "boolean"], EPDFPage_ApplyRedactions: [["number"], "boolean"], EPDFPage_CreateAnnot: [["number", "number"], "number"], EPDFPage_CreateFormField: [["number", "number", "number", "number"], "number"], EPDFPage_GetAnnotByName: [["number", "number"], "number"], EPDFPage_GetAnnotByObjectNumber: [["number", "number"], "number"], EPDFPage_GetAnnotCountRaw: [["number", "number"], "number"], EPDFPage_GetAnnotRaw: [["number", "number", "number"], "number"], EPDFPage_GetObjectNumber: [["number"], "number"], EPDFPage_MoveAnnots: [["number", "number", "number", "number"], "boolean"], EPDFPage_RemoveAnnot: [["number", "number"], "boolean"], EPDFPage_RemoveAnnotByName: [["number", "number"], "boolean"], EPDFPage_RemoveAnnotByObjectNumber: [["number", "number"], "boolean"], EPDFPage_RemoveAnnotRaw: [["number", "number", "number"], "boolean"], EPDFText_RedactInQuads: [["number", "number", "number", "boolean", "boolean"], "boolean"], EPDFText_RedactInRect: [["number", "number", "boolean", "boolean"], "boolean"], FORM_CanRedo: [["number", "number"], "boolean"], FORM_CanUndo: [["number", "number"], "boolean"], FORM_DoDocumentAAction: [["number", "number"], null], FORM_DoDocumentJSAction: [["number"], null], FORM_DoDocumentOpenAction: [["number"], null], FORM_DoPageAAction: [["number", "number", "number"], null], FORM_ForceToKillFocus: [["number"], "boolean"], FORM_GetFocusedAnnot: [["number", "number", "number"], "boolean"], FORM_GetFocusedText: [["number", "number", "number", "number"], "number"], FORM_GetSelectedText: [["number", "number", "number", "number"], "number"], FORM_IsIndexSelected: [["number", "number", "number"], "boolean"], FORM_OnAfterLoadPage: [["number", "number"], null], FORM_OnBeforeClosePage: [["number", "number"], null], FORM_OnChar: [["number", "number", "number", "number"], "boolean"], FORM_OnFocus: [["number", "number", "number", "number", "number"], "boolean"], FORM_OnKeyDown: [["number", "number", "number", "number"], "boolean"], FORM_OnKeyUp: [["number", "number", "number", "number"], "boolean"], FORM_OnLButtonDoubleClick: [["number", "number", "number", "number", "number"], "boolean"], FORM_OnLButtonDown: [["number", "number", "number", "number", "number"], "boolean"], FORM_OnLButtonUp: [["number", "number", "number", "number", "number"], "boolean"], FORM_OnMouseMove: [["number", "number", "number", "number", "number"], "boolean"], FORM_OnMouseWheel: [["number", "number", "number", "number", "number", "number"], "boolean"], FORM_OnRButtonDown: [["number", "number", "number", "number", "number"], "boolean"], FORM_OnRButtonUp: [["number", "number", "number", "number", "number"], "boolean"], FORM_Redo: [["number", "number"], "boolean"], FORM_ReplaceAndKeepSelection: [["number", "number", "number"], null], FORM_ReplaceSelection: [["number", "number", "number"], null], FORM_SelectAllText: [["number", "number"], "boolean"], FORM_SetFocusedAnnot: [["number", "number"], "boolean"], FORM_SetIndexSelected: [["number", "number", "number", "boolean"], "boolean"], FORM_Undo: [["number", "number"], "boolean"], FPDF_AddInstalledFont: [["number", "number", "number"], null], FPDF_CloseDocument: [["number"], null], FPDF_ClosePage: [["number"], null], FPDF_CloseXObject: [["number"], null], FPDF_CopyViewerPreferences: [["number", "number"], "boolean"], FPDF_CountNamedDests: [["number"], "number"], FPDF_CreateClipPath: [["number", "number", "number", "number"], "number"], FPDF_CreateNewDocument: [[], "number"], FPDF_DestroyClipPath: [["number"], null], FPDF_DestroyLibrary: [[], null], FPDF_DeviceToPage: [["number", "number", "number", "number", "number", "number", "number", "number", "number", "number"], "boolean"], FPDF_DocumentHasValidCrossReferenceTable: [["number"], "boolean"], FPDF_FFLDraw: [["number", "number", "number", "number", "number", "number", "number", "number", "number"], null], FPDF_FreeDefaultSystemFontInfo: [["number"], null], FPDF_GetDefaultSystemFontInfo: [[], "number"], FPDF_GetDefaultTTFMap: [[], "number"], FPDF_GetDefaultTTFMapCount: [[], "number"], FPDF_GetDefaultTTFMapEntry: [["number"], "number"], FPDF_GetDocPermissions: [["number"], "number"], FPDF_GetDocUserPermissions: [["number"], "number"], FPDF_GetFileIdentifier: [["number", "number", "number", "number"], "number"], FPDF_GetFileVersion: [["number", "number"], "boolean"], FPDF_GetFormType: [["number"], "number"], FPDF_GetLastError: [[], "number"], FPDF_GetMetaText: [["number", "string", "number", "number"], "number"], FPDF_GetNamedDest: [["number", "number", "number", "number"], "number"], FPDF_GetNamedDestByName: [["number", "string"], "number"], FPDF_GetPageAAction: [["number", "number"], "number"], FPDF_GetPageBoundingBox: [["number", "number"], "boolean"], FPDF_GetPageCount: [["number"], "number"], FPDF_GetPageHeight: [["number"], "number"], FPDF_GetPageHeightF: [["number"], "number"], FPDF_GetPageLabel: [["number", "number", "number", "number"], "number"], FPDF_GetPageSizeByIndex: [["number", "number", "number", "number"], "number"], FPDF_GetPageSizeByIndexF: [["number", "number", "number"], "boolean"], FPDF_GetPageWidth: [["number"], "number"], FPDF_GetPageWidthF: [["number"], "number"], FPDF_GetSecurityHandlerRevision: [["number"], "number"], FPDF_GetSignatureCount: [["number"], "number"], FPDF_GetSignatureObject: [["number", "number"], "number"], FPDF_GetTrailerEnds: [["number", "number", "number"], "number"], FPDF_GetXFAPacketContent: [["number", "number", "number", "number", "number"], "boolean"], FPDF_GetXFAPacketCount: [["number"], "number"], FPDF_GetXFAPacketName: [["number", "number", "number", "number"], "number"], FPDF_ImportNPagesToOne: [["number", "number", "number", "number", "number"], "number"], FPDF_ImportPages: [["number", "number", "string", "number"], "boolean"], FPDF_ImportPagesByIndex: [["number", "number", "number", "number", "number"], "boolean"], FPDF_InitLibrary: [[], null], FPDF_InitLibraryWithConfig: [["number"], null], FPDF_LoadCustomDocument: [["number", "string"], "number"], FPDF_LoadDocument: [["number", "string"], "number"], FPDF_LoadMemDocument: [["number", "number", "string"], "number"], FPDF_LoadMemDocument64: [["number", "number", "string"], "number"], FPDF_LoadPage: [["number", "number"], "number"], FPDF_LoadXFA: [["number"], "boolean"], FPDF_MovePages: [["number", "number", "number", "number"], "boolean"], FPDF_NewFormObjectFromXObject: [["number"], "number"], FPDF_NewXObjectFromPage: [["number", "number", "number"], "number"], FPDF_PageToDevice: [["number", "number", "number", "number", "number", "number", "number", "number", "number", "number"], "boolean"], FPDF_RemoveFormFieldHighlight: [["number"], null], FPDF_RenderPage_Close: [["number"], null], FPDF_RenderPage_Continue: [["number", "number"], "number"], FPDF_RenderPageBitmap: [["number", "number", "number", "number", "number", "number", "number", "number"], null], FPDF_RenderPageBitmap_Start: [["number", "number", "number", "number", "number", "number", "number", "number", "number"], "number"], FPDF_RenderPageBitmapWithColorScheme_Start: [["number", "number", "number", "number", "number", "number", "number", "number", "number", "number"], "number"], FPDF_RenderPageBitmapWithMatrix: [["number", "number", "number", "number", "number"], null], FPDF_SaveAsCopy: [["number", "number", "number"], "boolean"], FPDF_SaveWithVersion: [["number", "number", "number", "number"], "boolean"], FPDF_SetFormFieldHighlightAlpha: [["number", "number"], null], FPDF_SetFormFieldHighlightColor: [["number", "number", "number"], null], FPDF_SetSandBoxPolicy: [["number", "boolean"], null], FPDF_SetSystemFontInfo: [["number"], null], FPDF_StructElement_Attr_CountChildren: [["number"], "number"], FPDF_StructElement_Attr_GetBlobValue: [["number", "number", "number", "number"], "boolean"], FPDF_StructElement_Attr_GetBooleanValue: [["number", "number"], "boolean"], FPDF_StructElement_Attr_GetChildAtIndex: [["number", "number"], "number"], FPDF_StructElement_Attr_GetCount: [["number"], "number"], FPDF_StructElement_Attr_GetName: [["number", "number", "number", "number", "number"], "boolean"], FPDF_StructElement_Attr_GetNumberValue: [["number", "number"], "boolean"], FPDF_StructElement_Attr_GetStringValue: [["number", "number", "number", "number"], "boolean"], FPDF_StructElement_Attr_GetType: [["number"], "number"], FPDF_StructElement_Attr_GetValue: [["number", "string"], "number"], FPDF_StructElement_CountChildren: [["number"], "number"], FPDF_StructElement_GetActualText: [["number", "number", "number"], "number"], FPDF_StructElement_GetAltText: [["number", "number", "number"], "number"], FPDF_StructElement_GetAttributeAtIndex: [["number", "number"], "number"], FPDF_StructElement_GetAttributeCount: [["number"], "number"], FPDF_StructElement_GetChildAtIndex: [["number", "number"], "number"], FPDF_StructElement_GetChildMarkedContentID: [["number", "number"], "number"], FPDF_StructElement_GetID: [["number", "number", "number"], "number"], FPDF_StructElement_GetLang: [["number", "number", "number"], "number"], FPDF_StructElement_GetMarkedContentID: [["number"], "number"], FPDF_StructElement_GetMarkedContentIdAtIndex: [["number", "number"], "number"], FPDF_StructElement_GetMarkedContentIdCount: [["number"], "number"], FPDF_StructElement_GetObjType: [["number", "number", "number"], "number"], FPDF_StructElement_GetParent: [["number"], "number"], FPDF_StructElement_GetStringAttribute: [["number", "string", "number", "number"], "number"], FPDF_StructElement_GetTitle: [["number", "number", "number"], "number"], FPDF_StructElement_GetType: [["number", "number", "number"], "number"], FPDF_StructTree_Close: [["number"], null], FPDF_StructTree_CountChildren: [["number"], "number"], FPDF_StructTree_GetChildAtIndex: [["number", "number"], "number"], FPDF_StructTree_GetForPage: [["number"], "number"], FPDF_VIEWERREF_GetDuplex: [["number"], "number"], FPDF_VIEWERREF_GetName: [["number", "string", "number", "number"], "number"], FPDF_VIEWERREF_GetNumCopies: [["number"], "number"], FPDF_VIEWERREF_GetPrintPageRange: [["number"], "number"], FPDF_VIEWERREF_GetPrintPageRangeCount: [["number"], "number"], FPDF_VIEWERREF_GetPrintPageRangeElement: [["number", "number"], "number"], FPDF_VIEWERREF_GetPrintScaling: [["number"], "boolean"], FPDFAction_GetDest: [["number", "number"], "number"], FPDFAction_GetFilePath: [["number", "number", "number"], "number"], FPDFAction_GetType: [["number"], "number"], FPDFAction_GetURIPath: [["number", "number", "number", "number"], "number"], FPDFAnnot_AddFileAttachment: [["number", "number"], "number"], FPDFAnnot_AddInkStroke: [["number", "number", "number"], "number"], FPDFAnnot_AppendAttachmentPoints: [["number", "number"], "boolean"], FPDFAnnot_AppendObject: [["number", "number"], "boolean"], FPDFAnnot_CountAttachmentPoints: [["number"], "number"], FPDFAnnot_GetAP: [["number", "number", "number", "number"], "number"], FPDFAnnot_GetAttachmentPoints: [["number", "number", "number"], "boolean"], FPDFAnnot_GetBorder: [["number", "number", "number", "number"], "boolean"], FPDFAnnot_GetColor: [["number", "number", "number", "number", "number", "number"], "boolean"], FPDFAnnot_GetFileAttachment: [["number"], "number"], FPDFAnnot_GetFlags: [["number"], "number"], FPDFAnnot_GetFocusableSubtypes: [["number", "number", "number"], "boolean"], FPDFAnnot_GetFocusableSubtypesCount: [["number"], "number"], FPDFAnnot_GetFontColor: [["number", "number", "number", "number", "number"], "boolean"], FPDFAnnot_GetFontSize: [["number", "number", "number"], "boolean"], FPDFAnnot_GetFormAdditionalActionJavaScript: [["number", "number", "number", "number", "number"], "number"], FPDFAnnot_GetFormControlCount: [["number", "number"], "number"], FPDFAnnot_GetFormControlIndex: [["number", "number"], "number"], FPDFAnnot_GetFormFieldAlternateName: [["number", "number", "number", "number"], "number"], FPDFAnnot_GetFormFieldAtPoint: [["number", "number", "number"], "number"], FPDFAnnot_GetFormFieldExportValue: [["number", "number", "number", "number"], "number"], FPDFAnnot_GetFormFieldFlags: [["number", "number"], "number"], FPDFAnnot_GetFormFieldName: [["number", "number", "number", "number"], "number"], FPDFAnnot_GetFormFieldType: [["number", "number"], "number"], FPDFAnnot_GetFormFieldValue: [["number", "number", "number", "number"], "number"], FPDFAnnot_GetInkListCount: [["number"], "number"], FPDFAnnot_GetInkListPath: [["number", "number", "number", "number"], "number"], FPDFAnnot_GetLine: [["number", "number", "number"], "boolean"], FPDFAnnot_GetLink: [["number"], "number"], FPDFAnnot_GetLinkedAnnot: [["number", "string"], "number"], FPDFAnnot_GetNumberValue: [["number", "string", "number"], "boolean"], FPDFAnnot_GetObject: [["number", "number"], "number"], FPDFAnnot_GetObjectCount: [["number"], "number"], FPDFAnnot_GetOptionCount: [["number", "number"], "number"], FPDFAnnot_GetOptionLabel: [["number", "number", "number", "number", "number"], "number"], FPDFAnnot_GetRect: [["number", "number"], "boolean"], FPDFAnnot_GetStringValue: [["number", "string", "number", "number"], "number"], FPDFAnnot_GetSubtype: [["number"], "number"], FPDFAnnot_GetValueType: [["number", "string"], "number"], FPDFAnnot_GetVertices: [["number", "number", "number"], "number"], FPDFAnnot_HasAttachmentPoints: [["number"], "boolean"], FPDFAnnot_HasKey: [["number", "string"], "boolean"], FPDFAnnot_IsChecked: [["number", "number"], "boolean"], FPDFAnnot_IsObjectSupportedSubtype: [["number"], "boolean"], FPDFAnnot_IsOptionSelected: [["number", "number", "number"], "boolean"], FPDFAnnot_IsSupportedSubtype: [["number"], "boolean"], FPDFAnnot_RemoveInkList: [["number"], "boolean"], FPDFAnnot_RemoveObject: [["number", "number"], "boolean"], FPDFAnnot_SetAP: [["number", "number", "number"], "boolean"], FPDFAnnot_SetAttachmentPoints: [["number", "number", "number"], "boolean"], FPDFAnnot_SetBorder: [["number", "number", "number", "number"], "boolean"], FPDFAnnot_SetColor: [["number", "number", "number", "number", "number", "number"], "boolean"], FPDFAnnot_SetFlags: [["number", "number"], "boolean"], FPDFAnnot_SetFocusableSubtypes: [["number", "number", "number"], "boolean"], FPDFAnnot_SetFontColor: [["number", "number", "number", "number", "number"], "boolean"], FPDFAnnot_SetFormFieldFlags: [["number", "number", "number"], "boolean"], FPDFAnnot_SetRect: [["number", "number"], "boolean"], FPDFAnnot_SetStringValue: [["number", "string", "number"], "boolean"], FPDFAnnot_SetURI: [["number", "number"], "boolean"], FPDFAnnot_UpdateObject: [["number", "number"], "boolean"], FPDFAttachment_GetFile: [["number", "number", "number", "number"], "boolean"], FPDFAttachment_GetName: [["number", "number", "number"], "number"], FPDFAttachment_GetStringValue: [["number", "string", "number", "number"], "number"], FPDFAttachment_GetSubtype: [["number", "number", "number"], "number"], FPDFAttachment_GetValueType: [["number", "string"], "number"], FPDFAttachment_HasKey: [["number", "string"], "boolean"], FPDFAttachment_SetFile: [["number", "number", "number", "number"], "boolean"], FPDFAttachment_SetStringValue: [["number", "string", "number"], "boolean"], FPDFAvail_Create: [["number", "number"], "number"], FPDFAvail_Destroy: [["number"], null], FPDFAvail_GetDocument: [["number", "string"], "number"], FPDFAvail_GetFirstPageNum: [["number"], "number"], FPDFAvail_IsDocAvail: [["number", "number"], "number"], FPDFAvail_IsFormAvail: [["number", "number"], "number"], FPDFAvail_IsLinearized: [["number"], "number"], FPDFAvail_IsPageAvail: [["number", "number", "number"], "number"], FPDFBitmap_Create: [["number", "number", "number"], "number"], FPDFBitmap_CreateEx: [["number", "number", "number", "number", "number"], "number"], FPDFBitmap_Destroy: [["number"], null], FPDFBitmap_FillRect: [["number", "number", "number", "number", "number", "number"], "boolean"], FPDFBitmap_GetBuffer: [["number"], "number"], FPDFBitmap_GetFormat: [["number"], "number"], FPDFBitmap_GetHeight: [["number"], "number"], FPDFBitmap_GetStride: [["number"], "number"], FPDFBitmap_GetWidth: [["number"], "number"], FPDFBookmark_Find: [["number", "number"], "number"], FPDFBookmark_GetAction: [["number"], "number"], FPDFBookmark_GetCount: [["number"], "number"], FPDFBookmark_GetDest: [["number", "number"], "number"], FPDFBookmark_GetFirstChild: [["number", "number"], "number"], FPDFBookmark_GetNextSibling: [["number", "number"], "number"], FPDFBookmark_GetTitle: [["number", "number", "number"], "number"], FPDFCatalog_GetLanguage: [["number", "number", "number"], "number"], FPDFCatalog_IsTagged: [["number"], "boolean"], FPDFCatalog_SetLanguage: [["number", "number"], "boolean"], FPDFClipPath_CountPaths: [["number"], "number"], FPDFClipPath_CountPathSegments: [["number", "number"], "number"], FPDFClipPath_GetPathSegment: [["number", "number", "number"], "number"], FPDFDest_GetDestPageIndex: [["number", "number"], "number"], FPDFDest_GetLocationInPage: [["number", "number", "number", "number", "number", "number", "number"], "boolean"], FPDFDest_GetView: [["number", "number", "number"], "number"], FPDFDoc_AddAttachment: [["number", "number"], "number"], FPDFDoc_CloseJavaScriptAction: [["number"], null], FPDFDoc_DeleteAttachment: [["number", "number"], "boolean"], FPDFDOC_ExitFormFillEnvironment: [["number"], null], FPDFDoc_GetAttachment: [["number", "number"], "number"], FPDFDoc_GetAttachmentCount: [["number"], "number"], FPDFDoc_GetJavaScriptAction: [["number", "number"], "number"], FPDFDoc_GetJavaScriptActionCount: [["number"], "number"], FPDFDoc_GetPageMode: [["number"], "number"], FPDFDOC_InitFormFillEnvironment: [["number", "number"], "number"], FPDFFont_Close: [["number"], null], FPDFFont_GetAscent: [["number", "number", "number"], "boolean"], FPDFFont_GetBaseFontName: [["number", "number", "number"], "number"], FPDFFont_GetDescent: [["number", "number", "number"], "boolean"], FPDFFont_GetFamilyName: [["number", "number", "number"], "number"], FPDFFont_GetFlags: [["number"], "number"], FPDFFont_GetFontData: [["number", "number", "number", "number"], "boolean"], FPDFFont_GetGlyphPath: [["number", "number", "number"], "number"], FPDFFont_GetGlyphWidth: [["number", "number", "number", "number"], "boolean"], FPDFFont_GetIsEmbedded: [["number"], "number"], FPDFFont_GetItalicAngle: [["number", "number"], "boolean"], FPDFFont_GetWeight: [["number"], "number"], FPDFFormObj_CountObjects: [["number"], "number"], FPDFFormObj_GetObject: [["number", "number"], "number"], FPDFFormObj_RemoveObject: [["number", "number"], "boolean"], FPDFGlyphPath_CountGlyphSegments: [["number"], "number"], FPDFGlyphPath_GetGlyphPathSegment: [["number", "number"], "number"], FPDFImageObj_GetBitmap: [["number"], "number"], FPDFImageObj_GetIccProfileDataDecoded: [["number", "number", "number", "number", "number"], "boolean"], FPDFImageObj_GetImageDataDecoded: [["number", "number", "number"], "number"], FPDFImageObj_GetImageDataRaw: [["number", "number", "number"], "number"], FPDFImageObj_GetImageFilter: [["number", "number", "number", "number"], "number"], FPDFImageObj_GetImageFilterCount: [["number"], "number"], FPDFImageObj_GetImageMetadata: [["number", "number", "number"], "boolean"], FPDFImageObj_GetImagePixelSize: [["number", "number", "number"], "boolean"], FPDFImageObj_GetRenderedBitmap: [["number", "number", "number"], "number"], FPDFImageObj_LoadJpegFile: [["number", "number", "number", "number"], "boolean"], FPDFImageObj_LoadJpegFileInline: [["number", "number", "number", "number"], "boolean"], FPDFImageObj_SetBitmap: [["number", "number", "number", "number"], "boolean"], FPDFImageObj_SetMatrix: [["number", "number", "number", "number", "number", "number", "number"], "boolean"], FPDFJavaScriptAction_GetName: [["number", "number", "number"], "number"], FPDFJavaScriptAction_GetScript: [["number", "number", "number"], "number"], FPDFLink_CloseWebLinks: [["number"], null], FPDFLink_CountQuadPoints: [["number"], "number"], FPDFLink_CountRects: [["number", "number"], "number"], FPDFLink_CountWebLinks: [["number"], "number"], FPDFLink_Enumerate: [["number", "number", "number"], "boolean"], FPDFLink_GetAction: [["number"], "number"], FPDFLink_GetAnnot: [["number", "number"], "number"], FPDFLink_GetAnnotRect: [["number", "number"], "boolean"], FPDFLink_GetDest: [["number", "number"], "number"], FPDFLink_GetLinkAtPoint: [["number", "number", "number"], "number"], FPDFLink_GetLinkZOrderAtPoint: [["number", "number", "number"], "number"], FPDFLink_GetQuadPoints: [["number", "number", "number"], "boolean"], FPDFLink_GetRect: [["number", "number", "number", "number", "number", "number", "number"], "boolean"], FPDFLink_GetTextRange: [["number", "number", "number", "number"], "boolean"], FPDFLink_GetURL: [["number", "number", "number", "number"], "number"], FPDFLink_LoadWebLinks: [["number"], "number"], FPDFPage_CloseAnnot: [["number"], null], FPDFPage_CountObjects: [["number"], "number"], FPDFPage_CreateAnnot: [["number", "number"], "number"], FPDFPage_Delete: [["number", "number"], null], FPDFPage_Flatten: [["number", "number"], "number"], FPDFPage_FormFieldZOrderAtPoint: [["number", "number", "number", "number"], "number"], FPDFPage_GenerateContent: [["number"], "boolean"], FPDFPage_GetAnnot: [["number", "number"], "number"], FPDFPage_GetAnnotCount: [["number"], "number"], FPDFPage_GetAnnotIndex: [["number", "number"], "number"], FPDFPage_GetArtBox: [["number", "number", "number", "number", "number"], "boolean"], FPDFPage_GetBleedBox: [["number", "number", "number", "number", "number"], "boolean"], FPDFPage_GetCropBox: [["number", "number", "number", "number", "number"], "boolean"], FPDFPage_GetDecodedThumbnailData: [["number", "number", "number"], "number"], FPDFPage_GetMediaBox: [["number", "number", "number", "number", "number"], "boolean"], FPDFPage_GetObject: [["number", "number"], "number"], FPDFPage_GetRawThumbnailData: [["number", "number", "number"], "number"], FPDFPage_GetRotation: [["number"], "number"], FPDFPage_GetThumbnailAsBitmap: [["number"], "number"], FPDFPage_GetTrimBox: [["number", "number", "number", "number", "number"], "boolean"], FPDFPage_HasFormFieldAtPoint: [["number", "number", "number", "number"], "number"], FPDFPage_HasTransparency: [["number"], "boolean"], FPDFPage_InsertClipPath: [["number", "number"], null], FPDFPage_InsertObject: [["number", "number"], null], FPDFPage_InsertObjectAtIndex: [["number", "number", "number"], "boolean"], FPDFPage_New: [["number", "number", "number", "number"], "number"], FPDFPage_RemoveAnnot: [["number", "number"], "boolean"], FPDFPage_RemoveObject: [["number", "number"], "boolean"], FPDFPage_SetArtBox: [["number", "number", "number", "number", "number"], null], FPDFPage_SetBleedBox: [["number", "number", "number", "number", "number"], null], FPDFPage_SetCropBox: [["number", "number", "number", "number", "number"], null], FPDFPage_SetMediaBox: [["number", "number", "number", "number", "number"], null], FPDFPage_SetRotation: [["number", "number"], null], FPDFPage_SetTrimBox: [["number", "number", "number", "number", "number"], null], FPDFPage_TransformAnnots: [["number", "number", "number", "number", "number", "number", "number"], null], FPDFPage_TransFormWithClip: [["number", "number", "number"], "boolean"], FPDFPageObj_AddMark: [["number", "string"], "number"], FPDFPageObj_CountMarks: [["number"], "number"], FPDFPageObj_CreateNewPath: [["number", "number"], "number"], FPDFPageObj_CreateNewRect: [["number", "number", "number", "number"], "number"], FPDFPageObj_CreateTextObj: [["number", "number", "number"], "number"], FPDFPageObj_Destroy: [["number"], null], FPDFPageObj_GetBounds: [["number", "number", "number", "number", "number"], "boolean"], FPDFPageObj_GetClipPath: [["number"], "number"], FPDFPageObj_GetDashArray: [["number", "number", "number"], "boolean"], FPDFPageObj_GetDashCount: [["number"], "number"], FPDFPageObj_GetDashPhase: [["number", "number"], "boolean"], FPDFPageObj_GetFillColor: [["number", "number", "number", "number", "number"], "boolean"], FPDFPageObj_GetIsActive: [["number", "number"], "boolean"], FPDFPageObj_GetLineCap: [["number"], "number"], FPDFPageObj_GetLineJoin: [["number"], "number"], FPDFPageObj_GetMark: [["number", "number"], "number"], FPDFPageObj_GetMarkedContentID: [["number"], "number"], FPDFPageObj_GetMatrix: [["number", "number"], "boolean"], FPDFPageObj_GetRotatedBounds: [["number", "number"], "boolean"], FPDFPageObj_GetStrokeColor: [["number", "number", "number", "number", "number"], "boolean"], FPDFPageObj_GetStrokeWidth: [["number", "number"], "boolean"], FPDFPageObj_GetType: [["number"], "number"], FPDFPageObj_HasTransparency: [["number"], "boolean"], FPDFPageObj_NewImageObj: [["number"], "number"], FPDFPageObj_NewTextObj: [["number", "string", "number"], "number"], FPDFPageObj_RemoveMark: [["number", "number"], "boolean"], FPDFPageObj_SetBlendMode: [["number", "string"], null], FPDFPageObj_SetDashArray: [["number", "number", "number", "number"], "boolean"], FPDFPageObj_SetDashPhase: [["number", "number"], "boolean"], FPDFPageObj_SetFillColor: [["number", "number", "number", "number", "number"], "boolean"], FPDFPageObj_SetIsActive: [["number", "boolean"], "boolean"], FPDFPageObj_SetLineCap: [["number", "number"], "boolean"], FPDFPageObj_SetLineJoin: [["number", "number"], "boolean"], FPDFPageObj_SetMatrix: [["number", "number"], "boolean"], FPDFPageObj_SetStrokeColor: [["number", "number", "number", "number", "number"], "boolean"], FPDFPageObj_SetStrokeWidth: [["number", "number"], "boolean"], FPDFPageObj_Transform: [["number", "number", "number", "number", "number", "number", "number"], null], FPDFPageObj_TransformClipPath: [["number", "number", "number", "number", "number", "number", "number"], null], FPDFPageObj_TransformF: [["number", "number"], "boolean"], FPDFPageObjMark_CountParams: [["number"], "number"], FPDFPageObjMark_GetName: [["number", "number", "number", "number"], "boolean"], FPDFPageObjMark_GetParamBlobValue: [["number", "string", "number", "number", "number"], "boolean"], FPDFPageObjMark_GetParamFloatValue: [["number", "string", "number"], "boolean"], FPDFPageObjMark_GetParamIntValue: [["number", "string", "number"], "boolean"], FPDFPageObjMark_GetParamKey: [["number", "number", "number", "number", "number"], "boolean"], FPDFPageObjMark_GetParamStringValue: [["number", "string", "number", "number", "number"], "boolean"], FPDFPageObjMark_GetParamValueType: [["number", "string"], "number"], FPDFPageObjMark_RemoveParam: [["number", "number", "string"], "boolean"], FPDFPageObjMark_SetBlobParam: [["number", "number", "number", "string", "number", "number"], "boolean"], FPDFPageObjMark_SetFloatParam: [["number", "number", "number", "string", "number"], "boolean"], FPDFPageObjMark_SetIntParam: [["number", "number", "number", "string", "number"], "boolean"], FPDFPageObjMark_SetStringParam: [["number", "number", "number", "string", "string"], "boolean"], FPDFPath_BezierTo: [["number", "number", "number", "number", "number", "number", "number"], "boolean"], FPDFPath_Close: [["number"], "boolean"], FPDFPath_CountSegments: [["number"], "number"], FPDFPath_GetDrawMode: [["number", "number", "number"], "boolean"], FPDFPath_GetPathSegment: [["number", "number"], "number"], FPDFPath_LineTo: [["number", "number", "number"], "boolean"], FPDFPath_MoveTo: [["number", "number", "number"], "boolean"], FPDFPath_SetDrawMode: [["number", "number", "boolean"], "boolean"], FPDFPathSegment_GetClose: [["number"], "boolean"], FPDFPathSegment_GetPoint: [["number", "number", "number"], "boolean"], FPDFPathSegment_GetType: [["number"], "number"], FPDFSignatureObj_GetByteRange: [["number", "number", "number"], "number"], FPDFSignatureObj_GetContents: [["number", "number", "number"], "number"], FPDFSignatureObj_GetDocMDPPermission: [["number"], "number"], FPDFSignatureObj_GetReason: [["number", "number", "number"], "number"], FPDFSignatureObj_GetSubFilter: [["number", "number", "number"], "number"], FPDFSignatureObj_GetTime: [["number", "number", "number"], "number"], FPDFText_ClosePage: [["number"], null], FPDFText_CountChars: [["number"], "number"], FPDFText_CountRects: [["number", "number", "number"], "number"], FPDFText_FindClose: [["number"], null], FPDFText_FindNext: [["number"], "boolean"], FPDFText_FindPrev: [["number"], "boolean"], FPDFText_FindStart: [["number", "number", "number", "number"], "number"], FPDFText_GetBoundedText: [["number", "number", "number", "number", "number", "number", "number"], "number"], FPDFText_GetCharAngle: [["number", "number"], "number"], FPDFText_GetCharBox: [["number", "number", "number", "number", "number", "number"], "boolean"], FPDFText_GetCharIndexAtPos: [["number", "number", "number", "number", "number"], "number"], FPDFText_GetCharIndexFromTextIndex: [["number", "number"], "number"], FPDFText_GetCharOrigin: [["number", "number", "number", "number"], "boolean"], FPDFText_GetFillColor: [["number", "number", "number", "number", "number", "number"], "boolean"], FPDFText_GetFontInfo: [["number", "number", "number", "number", "number"], "number"], FPDFText_GetFontSize: [["number", "number"], "number"], FPDFText_GetFontWeight: [["number", "number"], "number"], FPDFText_GetLooseCharBox: [["number", "number", "number"], "boolean"], FPDFText_GetMatrix: [["number", "number", "number"], "boolean"], FPDFText_GetRect: [["number", "number", "number", "number", "number", "number"], "boolean"], FPDFText_GetSchCount: [["number"], "number"], FPDFText_GetSchResultIndex: [["number"], "number"], FPDFText_GetStrokeColor: [["number", "number", "number", "number", "number", "number"], "boolean"], FPDFText_GetText: [["number", "number", "number", "number"], "number"], FPDFText_GetTextIndexFromCharIndex: [["number", "number"], "number"], FPDFText_GetTextObject: [["number", "number"], "number"], FPDFText_GetUnicode: [["number", "number"], "number"], FPDFText_HasUnicodeMapError: [["number", "number"], "number"], FPDFText_IsGenerated: [["number", "number"], "number"], FPDFText_IsHyphen: [["number", "number"], "number"], FPDFText_LoadCidType2Font: [["number", "number", "number", "string", "number", "number"], "number"], FPDFText_LoadFont: [["number", "number", "number", "number", "boolean"], "number"], FPDFText_LoadPage: [["number"], "number"], FPDFText_LoadStandardFont: [["number", "string"], "number"], FPDFText_SetCharcodes: [["number", "number", "number"], "boolean"], FPDFText_SetText: [["number", "number"], "boolean"], FPDFTextObj_GetFont: [["number"], "number"], FPDFTextObj_GetFontSize: [["number", "number"], "boolean"], FPDFTextObj_GetRenderedBitmap: [["number", "number", "number", "number"], "number"], FPDFTextObj_GetText: [["number", "number", "number", "number"], "number"], FPDFTextObj_GetTextRenderMode: [["number"], "number"], FPDFTextObj_SetTextRenderMode: [["number", "number"], "boolean"], PDFiumExt_CloseFileWriter: [["number"], null], PDFiumExt_CloseFormFillInfo: [["number"], null], PDFiumExt_ExitFormFillEnvironment: [["number"], null], PDFiumExt_GetFileWriterData: [["number", "number", "number"], "number"], PDFiumExt_GetFileWriterSize: [["number"], "number"], PDFiumExt_Init: [[], null], PDFiumExt_InitFormFillEnvironment: [["number", "number"], "number"], PDFiumExt_OpenFileWriter: [[], "number"], PDFiumExt_OpenFormFillInfo: [[], "number"], PDFiumExt_SaveAsCopy: [["number", "number"], "number"] };
async function Li(u) {
  const n = { pdfium: u };
  for (const t in Wr) {
    const e = t, r = Wr[e][0], o = Wr[e][1];
    n[e] = u.cwrap(t, o, r);
  }
  return n;
}
async function ji(u) {
  const n = await Ii(u);
  return Li(n);
}
const Q = { TEXT: 1, LINK: 2, FREETEXT: 3, LINE: 4, SQUARE: 5, CIRCLE: 6, HIGHLIGHT: 9, UNDERLINE: 10, SQUIGGLY: 11, STRIKEOUT: 12, STAMP: 13, INK: 15, POPUP: 16, WIDGET: 20, REDACT: 28 }, Zn = { 1: "Note", 3: "Text box", 4: "Line", 5: "Rectangle", 6: "Ellipse", 9: "Highlight", 10: "Underline", 11: "Squiggly", 12: "Strikeout", 13: "Stamp", 15: "Drawing", 28: "Redaction" }, ye = { PUSHBUTTON: 1, CHECKBOX: 2, RADIO: 3, COMBO: 4, LIST: 5, TEXT: 6, SIGNATURE: 7 }, Xo = 17;
function Ua(u) {
  let n = "";
  for (let t = 0; t < u.length; t += 32768) n += String.fromCharCode.apply(null, u.subarray(t, t + 32768));
  return n;
}
function za(u) {
  const n = Ua(u);
  if (!n.includes("/MarginOn") && !n.includes("/MarginSig")) return u;
  const t = u.slice(), e = /(\d+ \d+ obj)([\s\S]*?)endobj/g;
  let r;
  const o = /* @__PURE__ */ new Set();
  for (const s of n.matchAll(/(\d+ \d+) obj((?:(?!endobj)[\s\S])*?\/MarginSig[\s\S]*?)endobj/g)) {
    const i = s[2].match(/\/Parent\s*(\d+ \d+) R/);
    i && o.add(i[1]);
  }
  const a = (s, i) => {
    for (let l = 0; l < i.length; l++) t[s + l] = i.charCodeAt(l) & 255;
  };
  for (; r = e.exec(n); ) {
    const s = r[2];
    if (o.has(r[1].replace(/ obj$/, "")) || /\/MarginSig\s*\(/.test(s)) {
      let m = s.replace(/\/MarginSig\s*\((?:[^()\\]|\\.)*\)/, "").replace(/\/Ff\s*8388608\b/, "").replace(/\/FT\s*\/Tx\b/, "/FT/Sig").replace(/\/DA\s*\((?:[^()\\]|\\.)*\)/, "");
      m.length > s.length && (m = m.replace(/\/Kids\s*\[\s+/, "/Kids[").replace(/\/T\s+\(/, "/T(")), m.length <= s.length && a(r.index + r[1].length, m + " ".repeat(s.length - m.length));
      continue;
    }
    const i = s.match(/\/MarginOn\s*\(((?:[^()\\]|\\.)*)\)/);
    if (!i) continue;
    const l = i[1].replace(/\\(.)/g, "$1").trim().replace(/[^A-Za-z0-9_.-]/g, "").slice(0, 24) || "On";
    let h = s.replace(i[0], "").replace(/\/Yes\b/g, "/" + l);
    h.length > s.length || a(r.index + r[1].length, h + " ".repeat(s.length - h.length));
  }
  return t;
}
function qo(u) {
  const n = (s) => (Math.round(s * 100) / 100).toString(), t = u.r - u.l, e = u.t - u.b, r = Math.min(8, t * 0.06), o = u.b + Math.max(4, e * 0.28), a = Math.min(7, e * 0.18);
  return [`q 0.47 0.49 0.53 RG 0.75 w ${n(u.l + 0.4)} ${n(u.b + 0.4)} ${n(t - 0.8)} ${n(e - 0.8)} re S`, `0.35 0.37 0.42 RG 0.6 w ${n(u.l + r)} ${n(o)} m ${n(u.r - r)} ${n(o)} l S`, `0.9 w ${n(u.l + r)} ${n(o + 3)} m ${n(u.l + r + a)} ${n(o + 3 + a)} l ${n(u.l + r)} ${n(o + 3 + a)} m ${n(u.l + r + a)} ${n(o + 3)} l S Q`].join(`
`);
}
function Bi(u) {
  const n = /* @__PURE__ */ new Map(), t = (r) => r === 32 || r === 10 || r === 13 || r === 9 || r === 12 || r === 0, e = (r) => r >= 48 && r <= 57;
  for (let r = u.indexOf(111, 4); r >= 0; r = u.indexOf(111, r + 1)) {
    if (u[r + 1] !== 98 || u[r + 2] !== 106 || u[r - 1] !== 32) continue;
    let o = r - 2;
    if (!e(u[o])) continue;
    for (; o > 0 && e(u[o - 1]); ) o--;
    if (u[o - 1] !== 32) continue;
    let a = o - 2;
    if (!e(u[a])) continue;
    for (; a > 0 && e(u[a - 1]); ) a--;
    if (a > 0 && !t(u[a - 1])) continue;
    let s = 0;
    for (let i = a; i < o - 1; i++) s = s * 10 + u[i] - 48;
    n.set(s, a);
  }
  return n;
}
function Ni(u, n, t, e) {
  try {
    const r = n.length;
    let o = -1;
    for (let O = r - 4; O > 0; O--) if (n[O] === 120 && n[O + 1] === 114 && n[O + 2] === 101 && n[O + 3] === 102 && (n[O - 1] === 10 || n[O - 1] === 13)) {
      o = O;
      break;
    }
    if (o < 0) return n;
    const a = Ua(n.subarray(o)), s = a.indexOf("trailer");
    if (s < 0) return n;
    const i = a.slice(4, s).trim().split(/\r\n|\r|\n/).map((O) => O.trim()).filter(Boolean), l = [];
    for (let O = 0; O < i.length; ) {
      const W = i[O++].split(/\s+/);
      if (W.length !== 2) return n;
      const N = +W[0], V = +W[1];
      for (let q = 0; q < V; q++) {
        const Y = (i[O++] || "").split(/\s+/);
        if (Y.length !== 3) return n;
        l.push({ num: N + q, off: +Y[0], gen: Y[1], t: Y[2] });
      }
    }
    const h = a.slice(s, a.indexOf("startxref")), m = l.filter((O) => O.t === "n").sort((O, W) => O.off - W.off), _ = u.length;
    if (m.some((O) => O.off < _ || O.off - _ >= o)) return n;
    const p = [];
    let P = 0;
    for (let O = 0; O < m.length; O++) {
      const W = m[O], N = W.off - _, V = O + 1 < m.length ? m[O + 1].off - _ : o, q = n.subarray(N, V);
      let Y = -1;
      for (let ee = q.length - 6; ee >= 0; ee--) if (q[ee] === 101 && q[ee + 1] === 110 && q[ee + 2] === 100 && q[ee + 3] === 111 && q[ee + 4] === 98 && q[ee + 5] === 106) {
        Y = ee + 6;
        break;
      }
      const ne = t.get(W.num);
      let J = Y > 0 && ne != null && ne + Y <= _;
      if (J) {
        for (let ee = 0; ee < Y; ee++) if (u[ne + ee] !== q[ee]) {
          J = false;
          break;
        }
      }
      J ? P++ : p.push({ e: W, bytes: q });
    }
    if (!P) {
      for (const O of m) e?.set(O.num, O.off);
      return n;
    }
    const D = n.subarray(0, m.length ? m[0].off - _ : o), x = [D];
    let A = D.length;
    const w = /* @__PURE__ */ new Map();
    for (const O of p) w.set(O.e.num, _ + A), e?.set(O.e.num, _ + A), x.push(O.bytes), A += O.bytes.length;
    const k = l.filter((O) => O.t !== "n" || w.has(O.num)).sort((O, W) => O.num - W.num);
    let G = `xref\r
`;
    for (let O = 0; O < k.length; ) {
      let W = O;
      for (; W + 1 < k.length && k[W + 1].num === k[W].num + 1; ) W++;
      G += `${k[O].num} ${W - O + 1}\r
`;
      for (let N = O; N <= W; N++) {
        const V = k[N];
        G += `${String(V.t === "n" ? w.get(V.num) : V.off).padStart(10, "0")} ${V.gen.padStart(5, "0")} ${V.t}\r
`;
      }
      O = W + 1;
    }
    G += h + `startxref\r
${_ + A}\r
%%EOF\r
`;
    const E = new Uint8Array(G.length);
    for (let O = 0; O < G.length; O++) E[O] = G.charCodeAt(O) & 255;
    x.push(E), A += E.length;
    const B = new Uint8Array(A);
    let z = 0;
    for (const O of x) B.set(O, z), z += O.length;
    return B;
  } catch {
    return n;
  }
}
function $i(u) {
  const n = new TextDecoder("latin1").decode(u);
  if (n.indexOf("/Parent") < 0) return u;
  const t = /* @__PURE__ */ new Set();
  for (const e of n.matchAll(/(?:^|[\r\n\s])(\d+)\s+(\d+)\s+obj\b/g)) t.add(e[1] + " " + e[2]);
  for (const e of n.matchAll(/\/Parent\s*(\d+)\s+(\d+)\s+R/g)) t.has(e[1] + " " + e[2]) || u.fill(32, e.index, e.index + e[0].length);
  return u;
}
class So {
  P;
  M;
  constructor(n) {
    this.P = n, this.M = n.pdfium, n.PDFiumExt_Init();
  }
  static async load(n) {
    const t = await ji({ wasmBinary: n });
    return new So(t);
  }
  alloc(n) {
    return this.M.wasmExports.malloc(Math.max(1, n));
  }
  free(n) {
    n && this.M.wasmExports.free(n);
  }
  bytes(n) {
    const t = this.alloc(n.length);
    return this.M.HEAPU8.set(n, t), t;
  }
  wstr(n) {
    const t = (n.length + 1) * 2, e = this.alloc(t);
    return this.M.stringToUTF16(n, e, t), e;
  }
  floats(n) {
    const t = this.alloc(n.length * 4);
    return n.forEach((e, r) => this.M.setValue(t + r * 4, e, "float")), t;
  }
  readFloats(n, t) {
    const e = [];
    for (let r = 0; r < t; r++) e.push(this.M.getValue(n + r * 4, "float"));
    return e;
  }
  readDoubles(n, t) {
    const e = [];
    for (let r = 0; r < t; r++) e.push(this.M.getValue(n + r * 8, "double"));
    return e;
  }
  readU32(n, t) {
    const e = [];
    for (let r = 0; r < t; r++) e.push(this.M.getValue(n + r * 4, "i32") >>> 0);
    return e;
  }
  readW(n) {
    const t = n(0, 0);
    if (!t || t <= 2) return "";
    const e = this.alloc(t);
    n(e, t);
    const r = this.M.UTF16ToString(e);
    return this.free(e), r;
  }
  tmp(n) {
    const t = [], e = (r) => {
      const o = this.alloc(r);
      return t.push(o), o;
    };
    try {
      return n(e);
    } finally {
      t.forEach((r) => this.free(r));
    }
  }
  open(n, t = "") {
    const e = this.source(n), r = this.P.FPDF_LoadCustomDocument(e.fa, t);
    if (!r) {
      const o = this.P.FPDF_GetLastError();
      throw this.dropSource(e), new rr(o);
    }
    return new Yo(this, r, e);
  }
  source(n) {
    if (n.length > 4294967295) throw new Error("Files over 4 GB can’t be opened");
    const t = this.M, e = t.addFunction((o, a, s, i) => (a >>>= 0, i >>>= 0, s >>>= 0, a + i > n.length ? 0 : (t.HEAPU8.set(n.subarray(a, a + i), s), 1)), "iiiii"), r = this.alloc(12);
    return t.setValue(r, n.length | 0, "i32"), t.setValue(r + 4, e, "i32"), t.setValue(r + 8, 0, "i32"), { bytes: n, fa: r, cb: e };
  }
  dropSource(n) {
    this.M.removeFunction(n.cb), this.free(n.fa);
  }
  create() {
    return new Yo(this, this.P.FPDF_CreateNewDocument(), null);
  }
}
const wo = (u) => /Aborted|out of memory|Cannot enlarge memory/i.test(String(u?.message ?? u)), Ha = "The PDF engine ran out of memory: this file is too large to edit in a browser tab. Reload Margin to keep working.";
class rr extends Error {
  code;
  constructor(n) {
    super({ 1: "Unknown error", 2: "File not found", 3: "Not a PDF or the file is damaged", 4: "Password required", 5: "Unsupported security scheme", 6: "Page not found" }[n] || "Could not open the PDF"), this.code = n;
  }
}
const zn = { None: 0, OpenArrow: 4, ClosedArrow: 5 }, Ui = { 0: "None", 4: "OpenArrow", 5: "ClosedArrow" }, Ue = (u) => (Math.abs(u) < 1e-4 ? 0 : u).toFixed(3).replace(/\.?0+$/, "") || "0";
class Yo {
  lib;
  P;
  h;
  src;
  form;
  finfo;
  imported = false;
  loaded = /* @__PURE__ */ new Set();
  depth = 0;
  constructor(n, t, e) {
    this.lib = n, this.P = n.P, this.h = t, this.src = e, this.finfo = this.P.PDFiumExt_OpenFormFillInfo(), this.form = this.P.PDFiumExt_InitFormFillEnvironment(t, this.finfo), this.form && this.P.FPDF_SetFormFieldHighlightColor(this.form, 0, 0);
  }
  close() {
    this.h && (this.form && this.P.PDFiumExt_ExitFormFillEnvironment(this.form), this.finfo && this.P.PDFiumExt_CloseFormFillInfo(this.finfo), this.P.FPDF_CloseDocument(this.h), this.src && this.lib.dropSource(this.src), this.form = 0, this.finfo = 0, this.src = null, this.h = 0);
  }
  swap(n, t = "", e, r = "") {
    this.close();
    const o = this.lib, a = this.P, s = (l) => {
      const h = o.source(l), m = a.FPDF_LoadCustomDocument(h.fa, t);
      return m || o.dropSource(h), m ? { h: m, src: h } : null;
    }, i = s(n) || (e ? s(e) : null);
    if (!i) throw new rr(a.FPDF_GetLastError());
    this.h = i.h, this.src = i.src, this.imported = false, this.loaded.clear(), r && a.EPDF_UnlockOwnerPermissions(this.h, r), this.finfo = a.PDFiumExt_OpenFormFillInfo(), this.form = a.PDFiumExt_InitFormFillEnvironment(this.h, this.finfo), this.form && a.FPDF_SetFormFieldHighlightColor(this.form, 0, 0);
  }
  get pageCount() {
    return this.P.FPDF_GetPageCount(this.h);
  }
  withPage(n, t, e = {}) {
    const r = this.P.FPDF_LoadPage(this.h, n);
    if (!r) throw new rr(6);
    this.loaded.add(n), this.depth++, this.form && this.P.FORM_OnAfterLoadPage(r, this.form);
    const o = e.text ? this.P.FPDFText_LoadPage(r) : 0;
    try {
      return t(r, o);
    } finally {
      o && this.P.FPDFText_ClosePage(o), this.form && this.P.FORM_OnBeforeClosePage(r, this.form), this.P.FPDF_ClosePage(r), this.depth--;
    }
  }
  pageSize(n) {
    const t = this.lib, e = t.alloc(8);
    try {
      if (this.P.FPDF_GetPageSizeByIndexF(this.h, n, e)) return { w: t.M.getValue(e, "float"), h: t.M.getValue(e + 4, "float") };
    } finally {
      t.free(e);
    }
    return this.withPage(n, (r) => ({ w: this.P.FPDF_GetPageWidthF(r), h: this.P.FPDF_GetPageHeightF(r) }));
  }
  pageBoxes(n) {
    const t = this.P, e = this.lib;
    return this.withPage(n, (r) => e.tmp((o) => {
      const a = o(16), s = (m) => t[m](r, a, a + 4, a + 8, a + 12) ? (([_, p, P, D]) => ({ l: Math.min(_, P), b: Math.min(p, D), r: Math.max(_, P), t: Math.max(p, D) }))(e.readFloats(a, 4)) : null, i = s("FPDFPage_GetMediaBox") || { l: 0, b: 0, r: t.FPDF_GetPageWidthF(r), t: t.FPDF_GetPageHeightF(r) }, l = s("FPDFPage_GetCropBox"), h = l ? { l: Math.max(l.l, i.l), b: Math.max(l.b, i.b), r: Math.min(l.r, i.r), t: Math.min(l.t, i.t) } : i;
      return { media: i, crop: h };
    }));
  }
  setCropBox(n, t) {
    const e = t || this.pageBoxes(n).media;
    this.withPage(n, (r) => this.P.FPDFPage_SetCropBox(r, e.l, e.b, e.r, e.t));
  }
  transform(n, t, e) {
    const o = this.lib;
    return this.withPage(n, (a) => o.tmp((s) => {
      const i = s(4), l = s(4), h = (P, D) => (this.P.FPDF_PageToDevice(a, 0, 0, Math.round(t * 64), Math.round(e * 64), 0, P, D, i, l), [o.M.getValue(i, "i32") / 64, o.M.getValue(l, "i32") / 64]), m = h(0, 0), _ = h(1e3, 0), p = h(0, 1e3);
      return new yt((_[0] - m[0]) / 1e3, (_[1] - m[1]) / 1e3, (p[0] - m[0]) / 1e3, (p[1] - m[1]) / 1e3, m[0], m[1]);
    }));
  }
  render(n, t, e, r = {}) {
    t = Math.max(1, Math.round(t)), e = Math.max(1, Math.round(e));
    const o = (r.annots === false ? Xo & -2 : Xo) | (r.print ? 2048 : 0);
    return this.withPage(n, (a) => {
      const s = this.P.FPDFBitmap_Create(t, e, 1);
      this.P.FPDFBitmap_FillRect(s, 0, 0, t, e, 4294967295), this.P.FPDF_RenderPageBitmap(s, a, 0, 0, t, e, 0, o), this.form && this.P.FPDF_FFLDraw(this.form, s, a, 0, 0, t, e, 0, o | 1);
      const i = this.P.FPDFBitmap_GetStride(s), l = this.P.FPDFBitmap_GetBuffer(s), h = this.lib.M.HEAPU8, m = new ImageData(t, e);
      if (i === t * 4) m.data.set(h.subarray(l, l + t * e * 4));
      else for (let _ = 0; _ < e; _++) m.data.set(h.subarray(l + _ * i, l + _ * i + t * 4), _ * t * 4);
      return this.P.FPDFBitmap_Destroy(s), m;
    });
  }
  save() {
    const n = this.write(0, 0);
    if (!n) throw new Error("PDFium could not write the file");
    return this.imported ? $i(n) : n;
  }
  write(n, t) {
    const e = this.P, r = this.lib, o = r.M;
    this.form && e.FORM_ForceToKillFocus(this.form);
    const a = this.src?.bytes;
    let s = new Uint8Array(t ? 0 : Math.max(65536, (a?.length ?? 0) + (1 << 20))), i = 0, l = 0, h = true;
    const m = [], _ = o.addFunction((D, x, A) => {
      x >>>= 0, A >>>= 0;
      const w = o.HEAPU8;
      if (l < t && a) {
        const G = Math.min(A, t - l, 32);
        for (let E = 0; E < G; E++) if (w[x + E] !== a[l + E]) {
          h = false;
          break;
        }
      }
      const k = Math.max(l, t);
      if (l + A > k) {
        const G = w.subarray(x + (k - l), x + A);
        if (t) m.push(G.slice());
        else {
          if (i + G.length > s.length) {
            const E = new Uint8Array(Math.max(i + G.length, Math.floor(s.length * 1.5)));
            E.set(s.subarray(0, i)), s = E;
          }
          s.set(G, i);
        }
        i += G.length;
      }
      return l += A, 1;
    }, "iiii"), p = r.alloc(8);
    o.setValue(p, 1, "i32"), o.setValue(p + 4, _, "i32");
    let P = false;
    try {
      P = !!e.FPDF_SaveAsCopy(this.h, p, n);
    } finally {
      o.removeFunction(_), r.free(p);
    }
    if (!P || !h || l < t) return null;
    if (t) {
      const D = new Uint8Array(i);
      let x = 0;
      for (const A of m) D.set(A, x), x += A.length;
      return D;
    }
    return i === s.length ? s : s.slice(0, i);
  }
  saveDelta(n) {
    return !this.src || this.src.bytes.length !== n ? null : this.write(1, n);
  }
  restackObjects(n, t, e) {
    const r = this.P, o = this.lib;
    return this.withPage(n, (a) => {
      const s = r.FPDFPage_CountObjects(a), i = new Set(t);
      if (!t.length) return false;
      const l = (w) => o.tmp((k) => {
        const G = k(16);
        r.FPDFPageObj_GetBounds(w, G, G + 4, G + 8, G + 12);
        const [E, B, z, O] = o.readFloats(G, 4);
        return { l: E, b: B, r: z, t: O };
      }), h = [...i].sort((w, k) => w - k).map((w) => r.FPDFPage_GetObject(a, w)), m = h.map(l).reduce((w, k) => ({ l: Math.min(w.l, k.l), b: Math.min(w.b, k.b), r: Math.max(w.r, k.r), t: Math.max(w.t, k.t) })), _ = (w) => {
        const k = l(r.FPDFPage_GetObject(a, w));
        return k.l < m.r && k.r > m.l && k.b < m.t && k.t > m.b;
      }, p = Math.min(...i), P = Math.max(...i);
      let D = -1;
      if (e === "front") {
        if (P === s - 1 && i.size === P - p + 1) return false;
        D = s - 1;
      } else if (e === "back") {
        if (p === 0 && i.size === P - p + 1) return false;
        D = -1;
      } else if (e === "forward") {
        for (let w = P + 1; w < s; w++) if (!i.has(w) && _(w)) {
          D = w;
          break;
        }
        if (D < 0) return false;
      } else {
        let w = false;
        for (let k = p - 1; k >= 0; k--) if (!i.has(k) && _(k)) {
          D = k - 1, w = true;
          break;
        }
        if (!w) return false;
      }
      const x = [...i].filter((w) => w <= D).length;
      let A = D - x + 1;
      for (let w = h.length - 1; w >= 0; w--) r.FPDFPage_RemoveObject(a, h[w]);
      for (const w of h) r.FPDFPage_InsertObjectAtIndex(a, w, A++);
      return r.FPDFPage_GenerateContent(a), true;
    });
  }
  restackAnnots(n, t, e) {
    const r = this.P, o = this.lib;
    return this.withPage(n, (a) => {
      const s = r.FPDFPage_GetAnnotCount(a), i = new Set(t.filter((w) => w >= 0 && w < s));
      if (!i.size) return false;
      const l = (w) => {
        const k = r.FPDFPage_GetAnnot(a, w);
        try {
          return { r: ft(o, k), st: r.FPDFAnnot_GetSubtype(k) };
        } finally {
          r.FPDFPage_CloseAnnot(k);
        }
      }, h = [...i].sort((w, k) => w - k), m = h.map((w) => l(w).r).reduce((w, k) => ({ l: Math.min(w.l, k.l), b: Math.min(w.b, k.b), r: Math.max(w.r, k.r), t: Math.max(w.t, k.t) })), _ = (w) => {
        const { r: k, st: G } = l(w);
        return G !== Q.POPUP && k.l < m.r && k.r > m.l && k.b < m.t && k.t > m.b;
      }, p = h[0], P = h[h.length - 1], D = P - p + 1 === h.length;
      let x = -1;
      if (e === "front") {
        if (P === s - 1 && D) return false;
        x = s - h.length;
      } else if (e === "back") {
        if (p === 0 && D) return false;
        x = 0;
      } else if (e === "forward") {
        for (let w = P + 1; w < s; w++) if (!i.has(w) && _(w)) {
          x = w - h.length + 1;
          break;
        }
      } else for (let w = p - 1; w >= 0; w--) if (!i.has(w) && _(w)) {
        x = w;
        break;
      }
      if (x < 0) return false;
      const A = o.alloc(4 * h.length);
      h.forEach((w, k) => o.M.setValue(A + 4 * k, w, "i32"));
      try {
        return !!r.EPDFPage_MoveAnnots(a, A, h.length, x);
      } finally {
        o.free(A);
      }
    });
  }
  outline() {
    const n = this.P, t = this.lib, e = /* @__PURE__ */ new Set(), r = (o, a, s) => {
      const i = [];
      if (s > 32) return i;
      for (let l = n.FPDFBookmark_GetFirstChild(this.h, o), h = 0; l && i.length < 5e3 && !e.has(l); l = n.FPDFBookmark_GetNextSibling(this.h, l), h++) {
        e.add(l);
        const m = [...a, h], _ = this.bmTarget(l);
        i.push({ title: t.readW((p, P) => n.FPDFBookmark_GetTitle(l, p, P)), ..._, path: m, children: r(l, m, s + 1) });
      }
      return i;
    };
    return r(0, [], 0);
  }
  bmTarget(n) {
    const t = this.P, e = this.lib;
    let r = t.FPDFBookmark_GetDest(this.h, n), o = null;
    if (!r) {
      const i = t.FPDFBookmark_GetAction(n);
      if (i) {
        const l = t.FPDFAction_GetType(i);
        if (l === 1) r = t.FPDFAction_GetDest(this.h, i);
        else if (l === 3) {
          const h = t.FPDFAction_GetURIPath(this.h, i, 0, 0);
          if (h > 1) {
            const m = e.alloc(h);
            t.FPDFAction_GetURIPath(this.h, i, m, h), o = e.M.UTF8ToString(m), e.free(m);
          }
        }
      }
    }
    if (!r) return { page: -1, top: null, uri: o };
    const a = t.FPDFDest_GetDestPageIndex(this.h, r), s = e.alloc(24);
    try {
      const l = t.FPDFDest_GetLocationInPage(r, s, s + 4, s + 8, s + 12, s + 16, s + 20) && e.M.getValue(s + 4, "i32") ? e.M.getValue(s + 16, "float") : null;
      return { page: a, top: l, uri: o };
    } finally {
      e.free(s);
    }
  }
  bmAt(n) {
    let t = 0;
    for (const e of n) {
      let r = this.P.FPDFBookmark_GetFirstChild(this.h, t);
      for (let o = 0; o < e && r; o++) r = this.P.FPDFBookmark_GetNextSibling(this.h, r);
      if (!r) return 0;
      t = r;
    }
    return t;
  }
  bmChild(n, t) {
    let e = this.P.FPDFBookmark_GetFirstChild(this.h, n);
    for (let r = 0; r < t && e; r++) e = this.P.FPDFBookmark_GetNextSibling(this.h, e);
    return e;
  }
  bmInsert(n, t, e) {
    const r = this.P, o = this.lib, a = n.length ? this.bmAt(n) : 0;
    if (n.length && !a) throw new Error("That bookmark no longer exists");
    const s = o.wstr(e);
    try {
      return t <= 0 ? r.EPDFBookmark_InsertAfter(this.h, a, 0, s) : r.EPDFBookmark_InsertAfter(this.h, a, this.bmChild(a, t - 1), s);
    } finally {
      o.free(s);
    }
  }
  addBookmark(n, t, e, r, o) {
    const a = this.bmInsert(n, t, e);
    if (!a) throw new Error("The bookmark could not be added");
    this.withPage(r, (s) => {
      const i = this.P.EPDFDest_CreateXYZ(s, false, 0, o != null, o ?? 0, false, 0);
      if (!i || !this.P.EPDFBookmark_SetDest(this.h, a, i)) throw new Error("The bookmark’s page could not be set");
    });
  }
  renameBookmark(n, t) {
    const e = this.bmAt(n);
    if (!e) throw new Error("That bookmark no longer exists");
    const r = this.lib.wstr(t);
    try {
      if (!this.P.EPDFBookmark_SetTitle(e, r)) throw new Error("The bookmark could not be renamed");
    } finally {
      this.lib.free(r);
    }
  }
  retargetBookmark(n, t, e) {
    const r = this.bmAt(n);
    if (!r) throw new Error("That bookmark no longer exists");
    this.withPage(t, (o) => {
      const a = this.P.EPDFDest_CreateXYZ(o, false, 0, e != null, e ?? 0, false, 0);
      this.P.EPDFBookmark_ClearTarget(r), this.P.EPDFBookmark_SetDest(this.h, r, a);
    });
  }
  deleteBookmark(n) {
    const t = this.bmAt(n);
    if (!t || !this.P.EPDFBookmark_Delete(this.h, t)) throw new Error("The bookmark could not be deleted");
  }
  moveBookmark(n, t, e) {
    const r = this.P, o = this.lib;
    if (t.length >= n.length && n.every((h, m) => t[m] === h)) throw new Error("A bookmark can’t go inside itself");
    const a = this.bmAt(n);
    if (!a) throw new Error("That bookmark no longer exists");
    const s = (h, m) => {
      const _ = r.FPDFBookmark_GetDest(this.h, h), p = r.FPDFBookmark_GetAction(h);
      _ ? r.EPDFBookmark_SetDest(this.h, m, _) : p && r.EPDFBookmark_SetAction(this.h, m, p);
      for (let P = r.FPDFBookmark_GetFirstChild(this.h, h); P; P = r.FPDFBookmark_GetNextSibling(this.h, P)) {
        const D = o.wstr(o.readW((A, w) => r.FPDFBookmark_GetTitle(P, A, w))), x = r.EPDFBookmark_AppendChild(this.h, m, D);
        o.free(D), x && s(P, x);
      }
    }, i = o.readW((h, m) => r.FPDFBookmark_GetTitle(a, h, m)), l = this.bmInsert(t, e, i);
    if (!l) throw new Error("The bookmark could not be moved");
    s(a, l), r.EPDFBookmark_Delete(this.h, a);
  }
  security() {
    const n = this.P.FPDF_GetSecurityHandlerRevision(this.h);
    return { encrypted: n > 0, revision: n, perms: this.P.FPDF_GetDocPermissions(this.h) >>> 0 };
  }
  unlockOwner(n) {
    return !!this.P.EPDF_UnlockOwnerPermissions(this.h, n);
  }
  setProtection(n, t, e) {
    return !!this.P.EPDF_SetEncryption(this.h, n, t, e | 0);
  }
  removeProtection() {
    return !!this.P.EPDF_RemoveEncryption(this.h);
  }
  rotate(n, t) {
    this.withPage(n, (e) => {
      this.P.FPDFPage_SetRotation(e, ((this.P.FPDFPage_GetRotation(e) + t) % 4 + 4) % 4);
    });
  }
  deletePage(n) {
    this.P.FPDFPage_Delete(this.h, n);
  }
  insertBlank(n, t, e) {
    const r = this.P.FPDFPage_New(this.h, n, t, e);
    this.P.FPDF_ClosePage(r);
  }
  movePages(n, t) {
    return this.lib.tmp((e) => {
      const r = e(n.length * 4);
      return n.forEach((o, a) => this.lib.M.setValue(r + a * 4, o, "i32")), !!this.P.FPDF_MovePages(this.h, r, n.length, t);
    });
  }
  importAll(n, t) {
    return this.imported = true, !!this.P.FPDF_ImportPagesByIndex(this.h, n.h, 0, 0, t);
  }
  importIndices(n, t, e) {
    return this.imported = true, this.lib.tmp((r) => {
      const o = r(t.length * 4);
      return t.forEach((a, s) => this.lib.M.setValue(o + s * 4, a, "i32")), !!this.P.FPDF_ImportPagesByIndex(this.h, n.h, o, t.length, e);
    });
  }
  textObjects(n) {
    const t = this.P, e = this.lib;
    return this.withPage(n, (r, o) => {
      const a = [], s = t.FPDFPage_CountObjects(r);
      for (let i = 0; i < s; i++) {
        const l = t.FPDFPage_GetObject(r, i);
        if (t.FPDFPageObj_GetType(l) !== 1) continue;
        const h = e.readW((P, D) => t.FPDFTextObj_GetText(l, o, P, D)), m = e.tmp((P) => {
          const D = P(16);
          t.FPDFPageObj_GetBounds(l, D, D + 4, D + 8, D + 12);
          const [x, A, w, k] = e.readFloats(D, 4), G = P(4);
          t.FPDFTextObj_GetFontSize(l, G);
          const E = P(16);
          t.FPDFPageObj_GetFillColor(l, E, E + 4, E + 8, E + 12);
          const B = P(24);
          t.FPDFPageObj_GetMatrix(l, B);
          const z = t.FPDFTextObj_GetFont(l);
          let O = "";
          if (z) {
            const W = P(256);
            O = t.FPDFFont_GetBaseFontName(z, W, 256) ? e.M.UTF8ToString(W) : "";
          }
          return { bounds: { l: x, b: A, r: w, t: k }, fontSize: e.readFloats(G, 1)[0], color: e.readU32(E, 4), matrix: e.readFloats(B, 6), fontName: O };
        }), _ = rn(e, l, "MarginText"), p = t.FPDFTextObj_GetTextRenderMode(l) === 3;
        p && !_ || a.push({ index: i, text: h, ...m, invisible: p, margin: _ || void 0 });
      }
      return a;
    }, { text: true });
  }
  pageWords(n, t) {
    const e = this.P, r = this.lib;
    return this.withPage(n, (o, a) => {
      const s = e.FPDFText_CountChars(a);
      if (s <= 0) return [];
      const i = r.tmp((h) => {
        const m = h((s + 1) * 2);
        return e.FPDFText_GetText(a, 0, s, m), r.M.UTF16ToString(m);
      }), l = [];
      return r.tmp((h) => {
        const m = h(32);
        for (const _ of i.matchAll(/[A-Za-z\u00C0-\u024F]+(?:['’][A-Za-z]+)*/g)) {
          const p = _[0];
          if (!t(p)) continue;
          const P = _.index, D = e.FPDFText_CountRects(a, P, p.length), x = [];
          for (let k = 0; k < D; k++) {
            e.FPDFText_GetRect(a, k, m, m + 8, m + 16, m + 24);
            const [G, E, B, z] = r.readDoubles(m, 4);
            x.push({ l: G, t: E, r: B, b: z });
          }
          const A = Math.max(0, P - 30), w = Math.min(i.length, P + p.length + 30);
          l.push({ word: p, rects: x, context: (A > 0 ? "…" : "") + i.slice(A, w).replace(/\s+/g, " ") + (w < i.length ? "…" : "") });
        }
      }), l;
    }, { text: true });
  }
  selectionRects(n, t, e) {
    const r = this.P, o = this.lib;
    return this.withPage(n, (a, s) => {
      let i = r.FPDFText_GetCharIndexAtPos(s, t.x, t.y, 6, 6), l = r.FPDFText_GetCharIndexAtPos(s, e.x, e.y, 6, 6);
      if (i < 0 || l < 0) return { rects: [], text: "" };
      i > l && ([i, l] = [l, i]);
      const h = l - i + 1, m = r.FPDFText_CountRects(s, i, h), _ = [];
      o.tmp((P) => {
        const D = P(32);
        for (let x = 0; x < m; x++) {
          r.FPDFText_GetRect(s, x, D, D + 8, D + 16, D + 24);
          const [A, w, k, G] = o.readDoubles(D, 4);
          _.push({ l: A, t: w, r: k, b: G });
        }
      });
      const p = o.tmp((P) => {
        const D = P((h + 1) * 2);
        return r.FPDFText_GetText(s, i, h, D), o.M.UTF16ToString(D);
      });
      return { rects: _, text: p };
    }, { text: true });
  }
  search(n, t = {}) {
    const e = this.P, r = this.lib, o = [];
    if (!n) return o;
    const a = (t.matchCase ? 1 : 0) | (t.wholeWord ? 2 : 0), s = r.wstr(n);
    try {
      for (let i = 0; i < this.pageCount; i++) this.withPage(i, (l, h) => {
        const m = e.FPDFText_FindStart(h, s, a, 0);
        m && (r.tmp((_) => {
          const p = _(32);
          for (; e.FPDFText_FindNext(m); ) {
            const P = e.FPDFText_GetSchResultIndex(m), D = e.FPDFText_GetSchCount(m), x = e.FPDFText_CountRects(h, P, D), A = [];
            for (let w = 0; w < x; w++) {
              e.FPDFText_GetRect(h, w, p, p + 8, p + 16, p + 24);
              const [k, G, E, B] = r.readDoubles(p, 4);
              A.push({ l: k, t: G, r: E, b: B });
            }
            if (A.length && o.push({ page: i, rects: A }), o.length > 2e3) break;
          }
        }), e.FPDFText_FindClose(m));
      }, { text: true });
    } finally {
      r.free(s);
    }
    return o;
  }
  annots(n) {
    const t = this.P, e = this.lib;
    return this.withPage(n, (r) => {
      const o = [], a = t.FPDFPage_GetAnnotCount(r);
      for (let s = 0; s < a; s++) {
        const i = t.FPDFPage_GetAnnot(r, s);
        try {
          const l = t.FPDFAnnot_GetSubtype(i);
          if (l === Q.POPUP || l === Q.LINK || l === Q.WIDGET) continue;
          const h = ft(e, i), m = e.tmp((D) => {
            const x = D(16);
            return t.EPDFAnnot_GetColor(i, 0, x, x + 4, x + 8) ? [...e.readU32(x, 3), 255] : t.FPDFAnnot_GetColor(i, 0, x, x + 4, x + 8, x + 12) ? e.readU32(x, 4) : null;
          }), _ = (D) => e.readW((x, A) => t.FPDFAnnot_GetStringValue(i, D, x, A)), p = { index: s, subtype: l, rect: h, color: m, contents: _("Contents"), author: _("T"), modified: _("M"), isMargin: _("NM").startsWith("margin-") };
          l === Q.LINE && (p.line = this.readLine(i) || void 0);
          const P = t.FPDFAnnot_GetLinkedAnnot(i, "IRT");
          if (P) {
            const D = t.FPDFPage_GetAnnotIndex(r, P);
            t.FPDFPage_CloseAnnot(P), D >= 0 && (p.irt = D);
          }
          if (l === Q.FREETEXT) try {
            const D = JSON.parse(_("MarginFT"));
            D?.box && (p.ft = { box: D.box, tip: D.tip });
          } catch {
          }
          o.push(p);
        } finally {
          t.FPDFPage_CloseAnnot(i);
        }
      }
      return o;
    });
  }
  newAnnot(n, t, e, r) {
    const o = this.P, a = this.lib, s = o.FPDFPage_CreateAnnot(n, t);
    if (!s) throw new Error("Could not create annotation");
    e && o.FPDFAnnot_SetColor(s, 0, e[0], e[1], e[2], e[3]);
    const i = (l, h) => {
      const m = a.wstr(h);
      o.FPDFAnnot_SetStringValue(s, l, m), a.free(m);
    };
    return i("T", r), i("M", _r()), i("NM", "margin-" + Math.random().toString(36).slice(2, 10)), o.FPDFAnnot_SetFlags(s, 4), s;
  }
  addMarkup(n, t, e, r, o, a = "") {
    const s = this.P, i = this.lib;
    this.withPage(n, (l) => {
      const h = this.newAnnot(l, t, r, o);
      try {
        for (const _ of e) {
          const p = i.floats([_.l, _.t, _.r, _.t, _.l, _.b, _.r, _.b]);
          s.FPDFAnnot_AppendAttachmentPoints(h, p), i.free(p);
        }
        const m = Jt(e);
        if (tt(i, h, m), a) {
          const _ = i.wstr(a);
          s.FPDFAnnot_SetStringValue(h, "Contents", _), i.free(_);
        }
        s.EPDFAnnot_GenerateAppearance(h);
      } finally {
        s.FPDFPage_CloseAnnot(h);
      }
    });
  }
  addInk(n, t, e, r, o) {
    const a = this.P, s = this.lib;
    this.withPage(n, (i) => {
      const l = this.newAnnot(i, Q.INK, e, o);
      try {
        a.FPDFAnnot_SetBorder(l, 0, 0, r);
        for (const _ of t) {
          const p = s.floats(_.flatMap((P) => [P.x, P.y]));
          a.FPDFAnnot_AddInkStroke(l, p, _.length), s.free(p);
        }
        const h = t.flat(), m = r;
        tt(s, l, { l: Math.min(...h.map((_) => _.x)) - m, r: Math.max(...h.map((_) => _.x)) + m, b: Math.min(...h.map((_) => _.y)) - m, t: Math.max(...h.map((_) => _.y)) + m }), a.EPDFAnnot_GenerateAppearance(l);
      } finally {
        a.FPDFPage_CloseAnnot(l);
      }
    });
  }
  addShape(n, t, e, r, o, a, c = {}) {
    const s = this.P, i = this.lib;
    this.withPage(n, (l) => {
      const h = this.newAnnot(l, t, r, a);
      try {
        s.FPDFAnnot_SetBorder(h, 0, 0, o), s.EPDFAnnot_SetBorderStyle(h, 1, o), tt(i, h, e);
        c.fill && s.EPDFAnnot_SetColor(h, 1, c.fill[0], c.fill[1], c.fill[2]);
        c.opacity != null && c.opacity < 1 && s.EPDFAnnot_SetOpacity(h, Math.round(Math.max(0.05, c.opacity) * 255));
        this.shapeAP(h);
      } finally {
        s.FPDFPage_CloseAnnot(h);
      }
    });
  }
  readLine(n) {
    const t = this.lib;
    return t.tmp((e) => {
      const r = e(16);
      if (!this.P.FPDFAnnot_GetLine(n, r, r + 8)) return null;
      const [o, a, s, i] = t.readFloats(r, 4);
      return [{ x: o, y: a }, { x: s, y: i }];
    });
  }
  writeLine(n, t, e) {
    const r = this.lib, o = r.floats([t.x, t.y]), a = r.floats([e.x, e.y]);
    this.P.EPDFAnnot_SetLine(n, o, a), r.free(o), r.free(a);
  }
  /** Rectangles and ellipses get Margin's own appearance: PDFium's strokes black when the outline
   *  colour (/C) is absent, but no /C means "no outline". Drawn in page space; BBox == Rect. */
  shapeAP(n) {
    const t = this.P, e = this.lib, r = ft(e, n), o = this.readStyle(n), a = e.tmp((x) => {
      const A = x(12);
      return t.EPDFAnnot_GetColor(n, 0, A, A + 4, A + 8) ? e.readU32(A, 3) : null;
    }), s = a && o.width > 0 ? o.width : 0, i = s / 2, l = r.l + i, h = r.r - i, m = r.b + i, _ = r.t - i;
    if (h - l <= 0 || _ - m <= 0) return;
    const p = (x) => x.slice(0, 3).map((A) => Ue(A / 255)).join(" "), P = o.dashed && s ? `[${Ue(Math.max(3, s * 3))} ${Ue(Math.max(2, s * 2))}] 0 d ` : "";
    let D;
    if (t.FPDFAnnot_GetSubtype(n) === Q.CIRCLE) {
      const x = (l + h) / 2, A = (m + _) / 2, w = (h - l) / 2, k = (_ - m) / 2, G = 0.5523;
      D = `${Ue(x + w)} ${Ue(A)} m ${Ue(x + w)} ${Ue(A + k * G)} ${Ue(x + w * G)} ${Ue(A + k)} ${Ue(x)} ${Ue(A + k)} c ${Ue(x - w * G)} ${Ue(A + k)} ${Ue(x - w)} ${Ue(A + k * G)} ${Ue(x - w)} ${Ue(A)} c ${Ue(x - w)} ${Ue(A - k * G)} ${Ue(x - w * G)} ${Ue(A - k)} ${Ue(x)} ${Ue(A - k)} c ${Ue(x + w * G)} ${Ue(A - k)} ${Ue(x + w)} ${Ue(A - k * G)} ${Ue(x + w)} ${Ue(A)} c h`;
    } else D = `${Ue(l)} ${Ue(m)} ${Ue(h - l)} ${Ue(_ - m)} re`;
    const x = o.fill ? s ? "B" : "f" : s ? "S" : "n", A = `q ${t.FPDFAnnot_HasKey(n, "CA") ? "/GS gs " : ""}${o.fill ? p(o.fill) + " rg " : ""}${s ? `${p(a)} RG ${Ue(s)} w 0 j ${P}` : ""}${D} ${x} Q`, w = e.wstr(A);
    t.FPDFAnnot_SetAP(n, 0, w), e.free(w);
  }
  /** Redraw an annotation's appearance after a change, by kind. */
  regenAP(n) {
    const t = this.P, e = t.FPDFAnnot_GetSubtype(n);
    e === Q.LINE ? this.lineAP(n) : e === Q.SQUARE || e === Q.CIRCLE ? this.shapeAP(n) : e !== Q.STAMP && e !== Q.FREETEXT && !this.isDrawn(n) && t.EPDFAnnot_GenerateAppearance(n);
  }
  lineAP(n) {
    const t = this.P, e = this.lib, r = this.readLine(n);
    if (!r) return;
    const [o, a] = r, s = e.tmp((z) => {
      const O = z(12);
      return t.FPDFAnnot_GetBorder(n, O, O + 4, O + 8) ? e.readFloats(O + 8, 1)[0] : 1;
    }) || 1, i = e.tmp((z) => {
      const O = z(12);
      return t.EPDFAnnot_GetColor(n, 0, O, O + 4, O + 8) ? e.readU32(O, 3) : [0, 0, 0];
    }), l = e.tmp((z) => {
      const O = z(8);
      return t.EPDFAnnot_GetLineEndings(n, O, O + 4) ? [e.M.getValue(O, "i32"), e.M.getValue(O + 4, "i32")] : [0, 0];
    }), h = e.tmp((z) => {
      const O = z(8);
      if (t.EPDFAnnot_GetBorderStyle(n, O) !== 2) return "";
      const W = t.EPDFAnnot_GetBorderDashPatternCount(n);
      if (W <= 0 || W > 8) return `[${Ue(s * 3)} ${Ue(s * 2)}] 0 d `;
      const N = z(W * 4);
      return t.EPDFAnnot_GetBorderDashPattern(n, N, W), `[${e.readFloats(N, W).map(Ue).join(" ")}] 0 d `;
    }), m = t.FPDFAnnot_HasKey(n, "CA") ? "/GS gs " : "", _ = i.map((z) => Ue(z / 255)).join(" "), p = Math.max(7, s * 4.5), P = 28 * Math.PI / 180, D = [o, a], x = [];
    let A = o, w = a;
    const k = (z, O, W) => {
      if (W !== 4 && W !== 5) return z;
      const N = z.x - O.x, V = z.y - O.y, q = Math.hypot(N, V) || 1, Y = N / q, ne = V / q, J = (de) => {
        const oe = Math.cos(P), fe = Math.sin(P) * de;
        return { x: z.x - p * (Y * oe - ne * fe), y: z.y - p * (ne * oe + Y * fe) };
      }, ee = J(1), ae = J(-1);
      return D.push(ee, ae), x.push(`${Ue(ee.x)} ${Ue(ee.y)} m ${Ue(z.x)} ${Ue(z.y)} l ${Ue(ae.x)} ${Ue(ae.y)} l ${W === 5 ? "h B" : "S"}`), W === 5 ? { x: z.x - Y * p * Math.cos(P) * 0.9, y: z.y - ne * p * Math.cos(P) * 0.9 } : z;
    };
    A = k(o, a, l[0]), w = k(a, o, l[1]);
    const G = s / 2 + 1.5;
    tt(e, n, { l: Math.min(...D.map((z) => z.x)) - G, r: Math.max(...D.map((z) => z.x)) + G, b: Math.min(...D.map((z) => z.y)) - G, t: Math.max(...D.map((z) => z.y)) + G });
    const E = `q ${m}${_} RG ${_} rg ${Ue(s)} w ${h ? "0 J" : "1 J"} 1 j ${h}${Ue(A.x)} ${Ue(A.y)} m ${Ue(w.x)} ${Ue(w.y)} l S 0 J 0 j ${h ? "[] 0 d " : ""}${x.join(" ")} Q`, B = e.wstr(E);
    t.FPDFAnnot_SetAP(n, 0, B), e.free(B);
  }
  addLine(n, t, e, r, o, a, s) {
    const i = this.P;
    this.withPage(n, (l) => {
      const h = this.newAnnot(l, Q.LINE, null, s);
      try {
        i.EPDFAnnot_SetColor(h, 0, r[0], r[1], r[2]), i.FPDFAnnot_SetBorder(h, 0, 0, o), this.writeLine(h, t, e), i.EPDFAnnot_SetLineEndings(h, zn[a[0]], zn[a[1]]), tt(this.lib, h, { l: Math.min(t.x, e.x), r: Math.max(t.x, e.x), b: Math.min(t.y, e.y), t: Math.max(t.y, e.y) }), this.lineAP(h);
      } finally {
        i.FPDFPage_CloseAnnot(h);
      }
    });
  }
  createFreeText(n, t) {
    return this.withPage(n, (e) => {
      const r = this.newAnnot(e, Q.FREETEXT, null, t);
      return this.P.FPDFPage_CloseAnnot(r), this.P.FPDFPage_GetAnnotCount(e) - 1;
    });
  }
  writeFreeText(n, t, e, r, o) {
    const a = this.P, s = this.lib;
    this.withPage(n, (i) => {
      const l = a.FPDFPage_GetAnnot(i, t);
      try {
        const h = (p, P) => {
          const D = s.wstr(P);
          a.FPDFAnnot_SetStringValue(l, p, D), s.free(D);
        };
        h("Contents", e.text), h("M", _r()), h("MarginFT", JSON.stringify(e));
        const m = e.style.color;
        if (a.EPDFAnnot_SetDefaultAppearance(l, 4, e.style.size, m[0], m[1], m[2]), e.style.border ? a.EPDFAnnot_SetColor(l, 0, e.style.border[0], e.style.border[1], e.style.border[2]) : a.EPDFAnnot_ClearColor(l, 0), e.style.fill ? a.EPDFAnnot_SetColor(l, 1, e.style.fill[0], e.style.fill[1], e.style.fill[2]) : a.EPDFAnnot_ClearColor(l, 1), a.FPDFAnnot_SetBorder(l, 0, 0, e.style.border ? e.style.borderWidth : 0), tt(s, l, r), a.EPDFAnnot_SetRectangleDifferences(l, e.box.l - r.l, r.t - e.box.t, r.r - e.box.r, e.box.b - r.b), e.tip) {
          const p = vo(e.box, e.tip), P = s.floats([e.tip.x, e.tip.y, p.x, p.y]);
          a.EPDFAnnot_SetCalloutLine(l, P, 2), s.free(P), a.EPDFAnnot_SetIntent(l, "FreeTextCallout"), a.EPDFAnnot_SetLineEndings(l, zn.OpenArrow, 0);
        } else a.EPDFAnnot_SetCalloutLine(l, 0, 0), a.EPDFAnnot_SetIntent(l, "FreeText");
        const _ = s.wstr(o);
        a.FPDFAnnot_SetAP(l, 0, _), s.free(_);
      } finally {
        a.FPDFPage_CloseAnnot(l);
      }
    });
  }
  readFreeText(n, t) {
    const e = this.P, r = this.lib;
    return this.withPage(n, (o) => {
      const a = e.FPDFPage_GetAnnot(o, t);
      try {
        if (e.FPDFAnnot_GetSubtype(a) !== Q.FREETEXT) return null;
        const s = (p) => r.readW((P, D) => e.FPDFAnnot_GetStringValue(a, p, P, D));
        try {
          const p = JSON.parse(s("MarginFT"));
          if (p?.box && p?.style) return { ...p, text: s("Contents") };
        } catch {
        }
        const i = ft(r, a), l = s("DA"), h = +(l.match(/([\d.]+)\s+Tf/)?.[1] || 12) || 12, m = l.match(/([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+rg/), _ = m ? [Math.round(+m[1] * 255), Math.round(+m[2] * 255), Math.round(+m[3] * 255), 255] : [0, 0, 0, 255];
        return { box: i, text: s("Contents"), style: { fontKey: "sarabun", size: h, color: _, fill: null, border: null, borderWidth: 1 } };
      } finally {
        e.FPDFPage_CloseAnnot(a);
      }
    });
  }
  flattenCounts() {
    const n = this.P;
    let t = 0, e = 0;
    for (let r = 0; r < this.pageCount; r++) this.withPage(r, (o) => {
      const a = n.FPDFPage_GetAnnotCount(o);
      for (let s = 0; s < a; s++) {
        const i = n.FPDFPage_GetAnnot(o, s), l = n.FPDFAnnot_GetSubtype(i);
        n.FPDFPage_CloseAnnot(i), l === Q.WIDGET ? e++ : l !== Q.LINK && l !== Q.POPUP && l !== Q.REDACT && t++;
      }
    });
    return { annots: t, fields: e };
  }
  flatten(n) {
    const t = this.P, e = this.lib;
    let r = 0, o = 0;
    this.form && t.FORM_ForceToKillFocus(this.form);
    for (let a = 0; a < this.pageCount; a++) this.withPage(a, (s) => {
      for (let i = t.FPDFPage_GetAnnotCount(s) - 1; i >= 0; i--) {
        const l = t.FPDFPage_GetAnnot(s, i);
        if (!l) continue;
        const h = t.FPDFAnnot_GetSubtype(l);
        let m = false, _ = false;
        try {
          if (h === Q.LINK || h === Q.REDACT || (h === Q.WIDGET ? !n.fields : !n.annots)) continue;
          if (h === Q.POPUP || t.FPDFAnnot_GetFlags(l) & 2) {
            m = true;
            continue;
          }
          if (_ = !!t.EPDFAnnot_Flatten(s, l), !_ && h === Q.WIDGET) {
            const p = t.FPDFAnnot_GetFormFieldType(this.form, l);
            if (p === ye.CHECKBOX || p === ye.RADIO) {
              const P = ft(e, l), D = !!t.FPDFAnnot_IsChecked(this.form, l), x = P.r - P.l, A = P.t - P.b, w = (E) => Ue(E);
              let k = "q 0 0 0 RG 0 0 0 rg 1 w ";
              if (p === ye.CHECKBOX) k += `${w(P.l + 0.5)} ${w(P.b + 0.5)} ${w(x - 1)} ${w(A - 1)} re S`, D && (k += ` 1.6 w 1 J 1 j ${w(P.l + x * 0.22)} ${w(P.b + A * 0.52)} m ${w(P.l + x * 0.42)} ${w(P.b + A * 0.28)} l ${w(P.l + x * 0.8)} ${w(P.b + A * 0.76)} l S`);
              else {
                const E = (P.l + P.r) / 2, B = (P.b + P.t) / 2, z = Math.min(x, A) / 2 - 0.5, O = 0.5523, W = (N) => `${w(E + N)} ${w(B)} m ${w(E + N)} ${w(B + N * O)} ${w(E + N * O)} ${w(B + N)} ${w(E)} ${w(B + N)} c ${w(E - N * O)} ${w(B + N)} ${w(E - N)} ${w(B + N * O)} ${w(E - N)} ${w(B)} c ${w(E - N)} ${w(B - N * O)} ${w(E - N * O)} ${w(B - N)} ${w(E)} ${w(B - N)} c ${w(E + N * O)} ${w(B - N)} ${w(E + N)} ${w(B - N * O)} ${w(E + N)} ${w(B)} c h`;
                k += W(z) + " S", D && (k += " " + W(z * 0.45) + " f");
              }
              k += " Q";
              const G = e.wstr(k);
              t.FPDFAnnot_SetAP(l, 0, G), e.free(G), _ = !!t.EPDFAnnot_Flatten(s, l);
            }
          } else _ || (t.EPDFAnnot_GenerateAppearance(l), _ = !!t.EPDFAnnot_Flatten(s, l));
        } finally {
          t.FPDFPage_CloseAnnot(l), m ? t.FPDFPage_RemoveAnnot(s, i) : h !== Q.LINK && h !== Q.REDACT && (h === Q.WIDGET ? n.fields : n.annots) && (_ ? r++ : o++);
        }
      }
      t.FPDFPage_GenerateContent(s);
    });
    return { done: r, failed: o };
  }
  addRedactMark(n, t, e) {
    const r = this.P, o = this.lib;
    this.withPage(n, (a) => {
      const s = this.newAnnot(a, Q.REDACT, null, e);
      try {
        for (const m of t) {
          const _ = o.floats([m.l, m.t, m.r, m.t, m.l, m.b, m.r, m.b]);
          r.FPDFAnnot_AppendAttachmentPoints(s, _), o.free(_);
        }
        const i = Jt(t);
        tt(o, s, { l: i.l - 1, r: i.r + 1, b: i.b - 1, t: i.t + 1 }), r.EPDFAnnot_SetColor(s, 0, 214, 40, 40), r.EPDFAnnot_SetColor(s, 1, 0, 0, 0);
        const l = ["q 0.84 0.16 0.16 RG 1.2 w [3 2] 0 d"];
        for (const m of t) l.push(`${Ue(m.l)} ${Ue(m.b)} ${Ue(m.r - m.l)} ${Ue(m.t - m.b)} re S ${Ue(m.l)} ${Ue(m.b)} m ${Ue(m.r)} ${Ue(m.t)} l S`);
        l.push("Q");
        const h = o.wstr(l.join(" "));
        r.FPDFAnnot_SetAP(s, 0, h), o.free(h);
      } finally {
        r.FPDFPage_CloseAnnot(s);
      }
    });
  }
  redactMarks() {
    const n = this.P, t = this.lib, e = [];
    for (let r = 0; r < this.pageCount; r++) this.withPage(r, (o) => {
      const a = [];
      for (let s = 0; s < n.FPDFPage_GetAnnotCount(o); s++) {
        const i = n.FPDFPage_GetAnnot(o, s);
        try {
          if (n.FPDFAnnot_GetSubtype(i) !== Q.REDACT) continue;
          const l = n.FPDFAnnot_CountAttachmentPoints(i);
          if (!l) {
            a.push(ft(t, i));
            continue;
          }
          for (let h = 0; h < l; h++) t.tmp((m) => {
            const _ = m(32);
            if (n.FPDFAnnot_GetAttachmentPoints(i, h, _)) {
              const p = t.readFloats(_, 8), P = [p[0], p[2], p[4], p[6]], D = [p[1], p[3], p[5], p[7]];
              a.push({ l: Math.min(...P), r: Math.max(...P), b: Math.min(...D), t: Math.max(...D) });
            }
          });
        } finally {
          n.FPDFPage_CloseAnnot(i);
        }
      }
      a.length && e.push({ page: r, rects: a });
    });
    return e;
  }
  clearRedactMarks() {
    const n = this.P;
    for (let t = 0; t < this.pageCount; t++) this.withPage(t, (e) => {
      for (let r = n.FPDFPage_GetAnnotCount(e) - 1; r >= 0; r--) {
        const o = n.FPDFPage_GetAnnot(e, r), a = n.FPDFAnnot_GetSubtype(o) === Q.REDACT;
        n.FPDFPage_CloseAnnot(o), a && n.FPDFPage_RemoveAnnot(e, r);
      }
    });
  }
  applyRedactions(n) {
    const t = this.P, e = this.lib, r = this.redactMarks();
    for (const { page: o, rects: a } of r) this.withPage(o, (s) => {
      t.EPDFPage_ApplyRedactions(s);
      const i = (l, h) => Math.max(0, Math.min(l.r, h.r) - Math.max(l.l, h.l)) * Math.max(0, Math.min(l.t, h.t) - Math.max(l.b, h.b));
      for (let l = t.FPDFPage_GetAnnotCount(s) - 1; l >= 0; l--) {
        const h = t.FPDFPage_GetAnnot(s, l), m = t.FPDFAnnot_GetSubtype(h), _ = ft(e, h);
        t.FPDFPage_CloseAnnot(h);
        const p = Math.max(1e-3, (_.r - _.l) * (_.t - _.b)), P = a.reduce((D, x) => D + i(_, x), 0);
        (m === Q.REDACT || P / p > 0.3) && t.FPDFPage_RemoveAnnot(s, l);
      }
      if (n) for (const l of a) {
        const h = t.FPDFPageObj_CreateNewRect(l.l, l.b, l.r - l.l, l.t - l.b);
        t.FPDFPageObj_SetFillColor(h, n[0], n[1], n[2], 255), t.FPDFPath_SetDrawMode(h, 1, 0), t.FPDFPage_InsertObject(s, h);
      }
      t.FPDFPage_GenerateContent(s);
    });
    return r.length;
  }
  links(n) {
    const t = this.P, e = this.lib;
    return this.withPage(n, (r) => {
      const o = [], a = t.FPDFPage_GetAnnotCount(r);
      for (let s = 0; s < a; s++) {
        const i = t.FPDFPage_GetAnnot(r, s);
        try {
          if (t.FPDFAnnot_GetSubtype(i) !== Q.LINK) continue;
          const l = { index: s, rect: ft(e, i) }, h = t.FPDFAnnot_GetLink(i);
          if (h) {
            const m = t.FPDFLink_GetAction(h), _ = m ? t.FPDFAction_GetType(m) : 0;
            if (_ === 3) {
              const p = t.FPDFAction_GetURIPath(this.h, m, 0, 0);
              if (p > 1) {
                const P = e.alloc(p);
                t.FPDFAction_GetURIPath(this.h, m, P, p), l.uri = e.M.UTF8ToString(P), e.free(P);
              }
            } else {
              const p = (m && _ === 1 ? t.FPDFAction_GetDest(this.h, m) : 0) || t.FPDFLink_GetDest(this.h, h);
              p && (l.page = t.FPDFDest_GetDestPageIndex(this.h, p));
            }
          }
          o.push(l);
        } finally {
          t.FPDFPage_CloseAnnot(i);
        }
      }
      return o;
    });
  }
  addLink(n, t, e) {
    const r = this.P, o = this.lib, a = "page" in e ? r.FPDF_LoadPage(this.h, e.page) : 0;
    this.depth++;
    try {
      this.withPage(n, (s) => {
        const i = r.FPDFPage_CreateAnnot(s, Q.LINK);
        if (!i) throw new Error("Could not create the link");
        try {
          tt(o, i, t), r.FPDFAnnot_SetBorder(i, 0, 0, 0);
          let l = 0;
          if ("uri" in e) l = r.EPDFAction_CreateURI(this.h, e.uri);
          else {
            const h = r.EPDFDest_CreateXYZ(a, false, 0, true, r.FPDF_GetPageHeightF(a), false, 0);
            l = h ? r.EPDFAction_CreateGoTo(this.h, h) : 0;
          }
          if (!l || !r.EPDFAnnot_SetAction(i, l)) throw new Error("Could not set the link target");
        } finally {
          r.FPDFPage_CloseAnnot(i);
        }
      });
    } finally {
      this.depth--, a && r.FPDF_ClosePage(a);
    }
  }
  setLinePoints(n, t, e, r) {
    this.withPage(n, (o) => {
      const a = this.P.FPDFPage_GetAnnot(o, t);
      try {
        this.writeLine(a, e, r), this.lineAP(a);
      } finally {
        this.P.FPDFPage_CloseAnnot(a);
      }
    });
  }
  addNote(n, t, e, r, o) {
    const a = this.P, s = this.lib;
    this.withPage(n, (i) => {
      const l = this.newAnnot(i, Q.TEXT, r, o);
      try {
        tt(s, l, { l: t.x, r: t.x + 20, t: t.y, b: t.y - 20 });
        const h = s.wstr(e);
        a.FPDFAnnot_SetStringValue(l, "Contents", h), s.free(h), a.EPDFAnnot_GenerateAppearance(l);
      } finally {
        a.FPDFPage_CloseAnnot(l);
      }
    });
  }
  addImageStamp(n, t, e, r, o, a, s = "Signature") {
    const i = this.P, l = this.lib, h = l.M;
    this.withPage(n, (m) => {
      const _ = i.FPDFBitmap_Create(r, o, 1), p = i.FPDFBitmap_GetBuffer(_), P = i.FPDFBitmap_GetStride(_);
      for (let w = 0; w < o; w++) for (let k = 0; k < r; k++) {
        const G = (w * r + k) * 4, E = p + w * P + k * 4;
        h.HEAPU8[E] = e[G + 2], h.HEAPU8[E + 1] = e[G + 1], h.HEAPU8[E + 2] = e[G], h.HEAPU8[E + 3] = e[G + 3];
      }
      const D = i.FPDFPageObj_NewImageObj(this.h);
      i.FPDFImageObj_SetBitmap(0, 0, D, _), i.FPDFBitmap_Destroy(_);
      const x = l.floats([t.r - t.l, 0, 0, t.t - t.b, t.l, t.b]);
      i.FPDFPageObj_SetMatrix(D, x), l.free(x);
      const A = this.newAnnot(m, Q.STAMP, null, a);
      try {
        tt(l, A, t);
        const w = l.wstr(s);
        i.FPDFAnnot_SetStringValue(A, "Contents", w), l.free(w), i.FPDFAnnot_AppendObject(A, D);
      } finally {
        i.FPDFPage_CloseAnnot(A);
      }
    });
  }
  addDrawnStamp(n, t, e, r, o) {
    const a = this.P, s = this.lib;
    return this.withPage(n, (i) => {
      const l = this.newAnnot(i, Q.STAMP, null, o);
      try {
        tt(s, l, t);
        const h = s.wstr(e);
        a.FPDFAnnot_SetStringValue(l, "Contents", h), s.free(h);
        const m = s.wstr(r);
        a.FPDFAnnot_SetAP(l, 0, m), s.free(m);
        const _ = s.wstr("1");
        a.FPDFAnnot_SetStringValue(l, "MarginAP", _), s.free(_);
      } finally {
        a.FPDFPage_CloseAnnot(l);
      }
      return a.FPDFPage_GetAnnotCount(i) - 1;
    });
  }
  addImage(n, t, e) {
    const r = this.P, o = this.lib;
    return this.withPage(n, (a) => {
      const s = r.FPDFPageObj_NewImageObj(this.h);
      this.fillImage(s, e);
      const i = o.floats(t);
      return r.FPDFPageObj_SetMatrix(s, i), o.free(i), r.FPDFPage_InsertObject(a, s), r.FPDFPage_GenerateContent(a), r.FPDFPage_CountObjects(a) - 1;
    });
  }
  fillImage(n, t) {
    const e = this.P, r = this.lib, o = r.M;
    if ("jpeg" in t) {
      const a = r.bytes(t.jpeg), s = t.jpeg.length, i = o.addFunction((m, _, p, P) => _ + P > s ? 0 : (o.HEAPU8.copyWithin(p, a + _, a + _ + P), 1), "iiiii"), l = r.alloc(12);
      o.setValue(l, s, "i32"), o.setValue(l + 4, i, "i32"), o.setValue(l + 8, 0, "i32");
      const h = e.FPDFImageObj_LoadJpegFileInline(0, 0, n, l);
      if (o.removeFunction(i), r.free(l), r.free(a), !h) throw e.FPDFPageObj_Destroy(n), new Error("That JPEG could not be read");
    } else {
      const { rgba: a, w: s, h: i } = t, l = e.FPDFBitmap_Create(s, i, 1), h = e.FPDFBitmap_GetBuffer(l), m = e.FPDFBitmap_GetStride(l);
      for (let _ = 0; _ < i; _++) for (let p = 0; p < s; p++) {
        const P = (_ * s + p) * 4, D = h + _ * m + p * 4;
        o.HEAPU8[D] = a[P + 2], o.HEAPU8[D + 1] = a[P + 1], o.HEAPU8[D + 2] = a[P], o.HEAPU8[D + 3] = a[P + 3];
      }
      e.FPDFImageObj_SetBitmap(0, 0, n, l), e.FPDFBitmap_Destroy(l);
    }
  }
  imageInfo(n, t) {
    const e = this.P, r = this.lib;
    return this.withPage(n, (o) => {
      const a = e.FPDFPage_GetObject(o, t);
      return !a || e.FPDFPageObj_GetType(a) !== 3 ? null : r.tmp((s) => {
        const i = s(24);
        e.FPDFPageObj_GetMatrix(a, i);
        const l = r.readFloats(i, 6), h = s(8);
        e.FPDFImageObj_GetImagePixelSize(a, h, h + 4);
        const [m, _] = [r.M.getValue(h, "i32"), r.M.getValue(h + 4, "i32")];
        let p = false;
        const P = e.FPDFImageObj_GetImageFilterCount(a);
        for (let D = 0; D < P; D++) {
          const x = e.FPDFImageObj_GetImageFilter(a, D, 0, 0), A = r.alloc(x);
          e.FPDFImageObj_GetImageFilter(a, D, A, x), r.M.UTF8ToString(A) === "DCTDecode" && (p = true), r.free(A);
        }
        return { matrix: l, w: m, h: _, jpeg: p };
      });
    });
  }
  imageList(n) {
    const t = this.P, e = this.lib, r = e.M;
    return this.withPage(n, (o) => {
      const a = [], s = t.FPDFPage_CountObjects(o);
      for (let i = 0; i < s; i++) {
        const l = t.FPDFPage_GetObject(o, i);
        if (t.FPDFPageObj_GetType(l) !== 3) continue;
        const h = e.tmp((D) => {
          const x = D(24);
          t.FPDFPageObj_GetMatrix(l, x);
          const [A, w, k, G] = e.readFloats(x, 4), E = D(8);
          return t.FPDFImageObj_GetImagePixelSize(l, E, E + 4), { w: r.getValue(E, "i32"), h: r.getValue(E + 4, "i32"), ptW: Math.hypot(A, w), ptH: Math.hypot(k, G) };
        });
        let m = false;
        const _ = t.FPDFImageObj_GetImageFilterCount(l);
        for (let D = 0; D < _; D++) {
          const x = t.FPDFImageObj_GetImageFilter(l, D, 0, 0), A = e.alloc(x);
          t.FPDFImageObj_GetImageFilter(l, D, A, x), e.M.UTF8ToString(A) === "DCTDecode" && (m = true), e.free(A);
        }
        const p = t.FPDFImageObj_GetImageDataRaw(l, 0, 0) >>> 0;
        let P = `${p}:${h.w}x${h.h}`;
        if (p) {
          const D = Math.min(p, 65536), x = e.alloc(p);
          t.FPDFImageObj_GetImageDataRaw(l, x, p);
          let A = 2166136261;
          for (let w = 0; w < D; w++) A = Math.imul(A ^ r.HEAPU8[x + w], 16777619);
          e.free(x), P += ":" + (A >>> 0).toString(36);
        }
        a.push({ k: i, ...h, jpeg: m, bytes: p, print: P });
      }
      return a;
    });
  }
  imagePixels(n, t) {
    const e = this.P, r = this.lib, o = r.M;
    return this.withPage(n, (a) => {
      const s = e.FPDFPage_GetObject(a, t);
      if (!s) return null;
      const i = r.tmp((A) => {
        const w = A(24);
        e.FPDFPageObj_GetMatrix(s, w);
        const k = A(8);
        return e.FPDFImageObj_GetImagePixelSize(s, k, k + 4), { m: r.readFloats(w, 6), w: o.getValue(k, "i32"), h: o.getValue(k + 4, "i32") };
      }), l = r.floats([i.w, 0, 0, i.h, 0, 0]);
      e.FPDFPageObj_SetMatrix(s, l), r.free(l);
      const h = e.FPDFImageObj_GetRenderedBitmap(this.h, a, s), m = r.floats(i.m);
      if (e.FPDFPageObj_SetMatrix(s, m), r.free(m), !h) return null;
      const _ = e.FPDFBitmap_GetWidth(h), p = e.FPDFBitmap_GetHeight(h), P = e.FPDFBitmap_GetStride(h), D = e.FPDFBitmap_GetBuffer(h), x = new Uint8ClampedArray(_ * p * 4);
      for (let A = 0; A < p; A++) for (let w = 0; w < _; w++) {
        const k = D + A * P + w * 4, G = (A * _ + w) * 4;
        x[G] = o.HEAPU8[k + 2], x[G + 1] = o.HEAPU8[k + 1], x[G + 2] = o.HEAPU8[k], x[G + 3] = o.HEAPU8[k + 3];
      }
      return e.FPDFBitmap_Destroy(h), { rgba: x, w: _, h: p };
    });
  }
  setImage(n, t, e, r) {
    const o = this.P, a = this.lib;
    this.withPage(n, (s) => {
      const i = o.FPDFPage_GetObject(s, t);
      if (!i) throw new Error("The image is gone");
      if (this.fillImage(i, e), r) {
        const l = a.floats(r);
        o.FPDFPageObj_SetMatrix(i, l), a.free(l);
      }
      o.FPDFPage_GenerateContent(s);
    });
  }
  deleteAnnot(n, t) {
    const e = this.P;
    this.withPage(n, (r) => {
      const o = /* @__PURE__ */ new Set([t]);
      for (let a = true; a; ) {
        a = false;
        for (let s = 0; s < e.FPDFPage_GetAnnotCount(r); s++) {
          if (o.has(s)) continue;
          const i = e.FPDFPage_GetAnnot(r, s), l = e.FPDFAnnot_GetLinkedAnnot(i, "IRT");
          let h = -1;
          l && (h = e.FPDFPage_GetAnnotIndex(r, l), e.FPDFPage_CloseAnnot(l)), e.FPDFPage_CloseAnnot(i), h >= 0 && o.has(h) && (o.add(s), a = true);
        }
      }
      for (const a of [...o].sort((s, i) => i - s)) e.FPDFPage_RemoveAnnot(r, a);
    });
  }
  addReply(n, t, e, r) {
    const o = this.P, a = this.lib;
    this.withPage(n, (s) => {
      const i = o.FPDFPage_GetAnnot(s, t);
      if (!i) throw new Error("That comment is gone");
      const l = ft(a, i), h = this.newAnnot(s, Q.TEXT, null, r);
      try {
        tt(a, h, { l: l.r, r: l.r + 1, t: l.t, b: l.t - 1 }), o.FPDFAnnot_SetFlags(h, 28);
        const m = a.wstr(e);
        if (o.FPDFAnnot_SetStringValue(h, "Contents", m), a.free(m), !o.EPDFAnnot_SetLinkedAnnot(h, "IRT", i)) throw new Error("Could not link the reply");
        const _ = a.wstr(" ");
        o.FPDFAnnot_SetAP(h, 0, _), a.free(_);
      } finally {
        o.FPDFPage_CloseAnnot(h), o.FPDFPage_CloseAnnot(i);
      }
    });
  }
  setAnnotContents(n, t, e) {
    const r = this.P, o = this.lib;
    this.withPage(n, (a) => {
      const s = r.FPDFPage_GetAnnot(a, t);
      try {
        const i = o.wstr(e);
        r.FPDFAnnot_SetStringValue(s, "Contents", i), o.free(i);
        const l = o.wstr(_r());
        r.FPDFAnnot_SetStringValue(s, "M", l), o.free(l);
      } finally {
        r.FPDFPage_CloseAnnot(s);
      }
    });
  }
  setAnnotColor(n, t, e) {
    const r = this.P;
    this.withPage(n, (o) => {
      const a = r.FPDFPage_GetAnnot(o, t);
      try {
        e ? r.EPDFAnnot_SetColor(a, 0, e[0], e[1], e[2]) || r.FPDFAnnot_SetColor(a, 0, e[0], e[1], e[2], e[3]) : r.EPDFAnnot_ClearColor(a, 0);
        const s = r.FPDFAnnot_GetSubtype(a);
        s === Q.SQUARE || s === Q.CIRCLE ? this.shapeAP(a) : s === Q.LINE ? this.lineAP(a) : s !== Q.STAMP && s !== Q.FREETEXT && r.EPDFAnnot_GenerateAppearance(a);
      } finally {
        r.FPDFPage_CloseAnnot(a);
      }
    });
  }
  annotStyle(n, t) {
    const e = this.P;
    return this.withPage(n, (r) => {
      const o = e.FPDFPage_GetAnnot(r, t);
      if (!o) return null;
      try {
        return this.readStyle(o);
      } finally {
        e.FPDFPage_CloseAnnot(o);
      }
    });
  }
  readStyle(n) {
    const t = this.P, e = this.lib;
    return e.tmp((r) => {
      const o = r(16), a = t.EPDFAnnot_GetBorderStyle(n, o);
      let s = a > 0 ? e.readFloats(o, 1)[0] : 0;
      a > 0 || (s = t.FPDFAnnot_GetBorder(n, o, o + 4, o + 8) ? e.readFloats(o + 8, 1)[0] : 1);
      const i = a === 2, l = t.EPDFAnnot_GetColor(n, 1, o, o + 4, o + 8) ? [...e.readU32(o, 3), 255] : null, h = t.FPDFAnnot_HasKey(n, "CA") && t.EPDFAnnot_GetOpacity(n, o) ? (e.M.getValue(o, "i32") & 255) / 255 : 1, m = { width: s, dashed: i, fill: l, opacity: h };
      if (t.FPDFAnnot_GetSubtype(n) === Q.LINE) {
        const _ = t.EPDFAnnot_GetLineEndings(n, o, o + 4) ? [e.M.getValue(o, "i32"), e.M.getValue(o + 4, "i32")] : [0, 0];
        m.ends = _.map((p) => Ui[p] || "None");
      }
      return m;
    });
  }
  writeStyle(n, t) {
    const e = this.P, r = this.lib, o = this.readStyle(n), a = t.width ?? o.width, s = t.dashed ?? o.dashed;
    if ((t.width != null || t.dashed != null) && (e.FPDFAnnot_SetBorder(n, 0, 0, a), e.EPDFAnnot_SetBorderStyle(n, s ? 2 : 1, a), s)) {
      const h = r.floats([Math.max(3, a * 3), Math.max(2, a * 2)]);
      e.EPDFAnnot_SetBorderDashPattern(n, h, 2), r.free(h);
    }
    "fill" in t && (t.fill ? e.EPDFAnnot_SetColor(n, 1, t.fill[0], t.fill[1], t.fill[2]) : e.EPDFAnnot_ClearColor(n, 1)), t.opacity != null && e.EPDFAnnot_SetOpacity(n, Math.round(Math.max(0.05, Math.min(1, t.opacity)) * 255)), t.ends && e.EPDFAnnot_SetLineEndings(n, zn[t.ends[0]], zn[t.ends[1]]);
    const i = r.wstr(_r());
    e.FPDFAnnot_SetStringValue(n, "M", i), r.free(i);
    this.regenAP(n);
  }
  setAnnotStyle(n, t, e) {
    const r = this.P;
    this.withPage(n, (o) => {
      const a = r.FPDFPage_GetAnnot(o, t);
      if (!a) throw new Error("That annotation is gone");
      try {
        this.writeStyle(a, e);
      } finally {
        r.FPDFPage_CloseAnnot(a);
      }
    });
  }
  reverseLine(n, t) {
    const e = this.P;
    this.withPage(n, (r) => {
      const o = e.FPDFPage_GetAnnot(r, t);
      try {
        const a = this.readLine(o);
        if (!a) throw new Error("Not a line");
        this.writeLine(o, a[1], a[0]), this.lineAP(o);
      } finally {
        e.FPDFPage_CloseAnnot(o);
      }
    });
  }
  imageJpeg(n, t) {
    const e = this.P, r = this.lib;
    return this.withPage(n, (o) => {
      const a = e.FPDFPage_GetObject(o, t);
      if (!a || e.FPDFPageObj_GetType(a) !== 3) return null;
      const s = e.FPDFImageObj_GetImageDataRaw(a, 0, 0);
      if (s <= 0) return null;
      const i = r.alloc(s);
      e.FPDFImageObj_GetImageDataRaw(a, i, s);
      const l = r.M.HEAPU8.slice(i, i + s);
      return r.free(i), l[0] === 255 && l[1] === 216 ? l : null;
    });
  }
  readClip(n, t, e) {
    const r = this.P, o = this.lib, a = [];
    let s = 0;
    for (const i of t) {
      const l = this.withPage(n, (m) => {
        const _ = r.FPDFPage_GetAnnot(m, i);
        if (!_) return null;
        try {
          const p = r.FPDFAnnot_GetSubtype(_);
          if (p === Q.FREETEXT || ![Q.SQUARE, Q.CIRCLE, Q.LINE, Q.INK, Q.TEXT, Q.STAMP].includes(p)) return null;
          const P = (A) => o.readW((w, k) => r.FPDFAnnot_GetStringValue(_, A, w, k)), D = o.tmp((A) => {
            const w = A(16);
            return r.EPDFAnnot_GetColor(_, 0, w, w + 4, w + 8) ? [...o.readU32(w, 3), 255] : r.FPDFAnnot_GetColor(_, 0, w, w + 4, w + 8, w + 12) ? o.readU32(w, 4) : null;
          }), x = { t: "annot", subtype: p, rect: ft(o, _), color: D, contents: P("Contents"), style: this.readStyle(_) };
          if (p === Q.LINE) {
            const A = this.readLine(_);
            if (!A) return null;
            x.line = A;
          }
          if (p === Q.INK) {
            x.ink = [];
            for (let A = 0, w = r.FPDFAnnot_GetInkListCount(_); A < w; A++) {
              const k = r.FPDFAnnot_GetInkListPath(_, A, 0, 0), G = o.alloc(k * 8);
              r.FPDFAnnot_GetInkListPath(_, A, G, k), x.ink.push(o.readFloats(G, k * 2)), o.free(G);
            }
          }
          if (p === Q.STAMP) if (this.isDrawn(_)) {
            const A = o.readW((w, k) => r.FPDFAnnot_GetAP(_, 0, w, k));
            if (!A) return null;
            x.ap = A;
          } else {
            x.images = [];
            for (let A = 0, w = r.FPDFAnnot_GetObjectCount(_); A < w; A++) {
              const k = r.FPDFAnnot_GetObject(_, A);
              if (r.FPDFPageObj_GetType(k) !== 3) return null;
              const G = this.renderImageObj(m, k);
              if (!G) return null;
              x.images.push(G);
            }
            if (!x.images.length) return null;
          }
          return x;
        } finally {
          r.FPDFPage_CloseAnnot(_);
        }
      });
      if (l) {
        a.push(l);
        continue;
      }
      const h = this.withPage(n, (m) => {
        const _ = r.FPDFPage_GetAnnot(m, i);
        if (!_) return false;
        const p = r.FPDFAnnot_GetSubtype(_);
        return r.FPDFPage_CloseAnnot(_), p === Q.FREETEXT;
      }) ? this.readFreeText(n, i) : null;
      h ? a.push({ t: "ft", data: h }) : s++;
    }
    for (const i of e) {
      const l = this.imageInfo(n, i);
      if (!l) {
        s++;
        continue;
      }
      const h = l.jpeg ? this.imageJpeg(n, i) : null;
      if (h) {
        a.push({ t: "img", m: l.matrix, src: { jpeg: h } });
        continue;
      }
      const m = this.imagePixels(n, i);
      if (!m) {
        s++;
        continue;
      }
      a.push({ t: "img", m: l.matrix, src: { rgba: m.rgba, w: m.w, h: m.h } });
    }
    return { items: a, skipped: s };
  }
  renderImageObj(n, t) {
    const e = this.P, r = this.lib, o = r.M, a = r.tmp((x) => {
      const A = x(24);
      return e.FPDFPageObj_GetMatrix(t, A), r.readFloats(A, 6);
    }), s = r.tmp((x) => {
      const A = x(8);
      return e.FPDFImageObj_GetImagePixelSize(t, A, A + 4), [o.getValue(A, "i32"), o.getValue(A + 4, "i32")];
    }), i = r.floats([s[0] || 1, 0, 0, s[1] || 1, 0, 0]);
    e.FPDFPageObj_SetMatrix(t, i), r.free(i);
    const l = e.FPDFImageObj_GetRenderedBitmap(this.h, n, t), h = r.floats(a);
    if (e.FPDFPageObj_SetMatrix(t, h), r.free(h), !l) return null;
    const m = e.FPDFBitmap_GetWidth(l), _ = e.FPDFBitmap_GetHeight(l), p = e.FPDFBitmap_GetStride(l), P = e.FPDFBitmap_GetBuffer(l), D = new Uint8ClampedArray(m * _ * 4);
    for (let x = 0; x < _; x++) for (let A = 0; A < m; A++) {
      const w = P + x * p + A * 4, k = (x * m + A) * 4;
      D[k] = o.HEAPU8[w + 2], D[k + 1] = o.HEAPU8[w + 1], D[k + 2] = o.HEAPU8[w], D[k + 3] = o.HEAPU8[w + 3];
    }
    return e.FPDFBitmap_Destroy(l), { m: a, rgba: D, w: m, h: _ };
  }
  writeClip(n, t, e, r, o) {
    const a = this.P, s = this.lib, i = s.M, l = [], h = (m) => ({ l: m.l + e, r: m.r + e, t: m.t + r, b: m.b + r });
    for (const m of t) {
      if (m.t === "ft") continue;
      if (m.t === "img") {
        const P = m.m;
        l.push("o" + this.addImage(n, [P[0], P[1], P[2], P[3], P[4] + e, P[5] + r], m.src));
        continue;
      }
      const _ = m.subtype, p = this.withPage(n, (P) => {
        let D = 0;
        if (_ === Q.STAMP) if (D = this.newAnnot(P, Q.STAMP, null, o), tt(s, D, h(m.rect)), m.ap != null) {
          const x = s.wstr(`q 1 0 0 1 ${Ue(e)} ${Ue(r)} cm
${m.ap}
Q`);
          a.FPDFAnnot_SetAP(D, 0, x), s.free(x);
          const A = s.wstr("1");
          a.FPDFAnnot_SetStringValue(D, "MarginAP", A), s.free(A);
        } else for (const x of m.images || []) {
          const A = a.FPDFBitmap_Create(x.w, x.h, 1), w = a.FPDFBitmap_GetBuffer(A), k = a.FPDFBitmap_GetStride(A);
          for (let B = 0; B < x.h; B++) for (let z = 0; z < x.w; z++) {
            const O = (B * x.w + z) * 4, W = w + B * k + z * 4;
            i.HEAPU8[W] = x.rgba[O + 2], i.HEAPU8[W + 1] = x.rgba[O + 1], i.HEAPU8[W + 2] = x.rgba[O], i.HEAPU8[W + 3] = x.rgba[O + 3];
          }
          const G = a.FPDFPageObj_NewImageObj(this.h);
          a.FPDFImageObj_SetBitmap(0, 0, G, A), a.FPDFBitmap_Destroy(A);
          const E = s.floats([x.m[0], x.m[1], x.m[2], x.m[3], x.m[4] + e, x.m[5] + r]);
          a.FPDFPageObj_SetMatrix(G, E), s.free(E), a.FPDFAnnot_AppendObject(D, G);
        }
        else {
          D = this.newAnnot(P, _, _ === Q.LINE ? null : m.color, o), _ === Q.LINE && m.line && (m.color && a.EPDFAnnot_SetColor(D, 0, m.color[0], m.color[1], m.color[2]), this.writeLine(D, { x: m.line[0].x + e, y: m.line[0].y + r }, { x: m.line[1].x + e, y: m.line[1].y + r })), tt(s, D, h(m.rect));
          for (const x of m.ink || []) {
            const A = s.floats(x.map((w, k) => w + (k % 2 ? r : e)));
            a.FPDFAnnot_AddInkStroke(D, A, x.length / 2), s.free(A);
          }
        }
        try {
          if (m.contents) {
            const x = s.wstr(m.contents);
            a.FPDFAnnot_SetStringValue(D, "Contents", x), s.free(x);
          }
          _ === Q.TEXT ? a.EPDFAnnot_GenerateAppearance(D) : _ !== Q.STAMP && this.writeStyle(D, m.style);
        } finally {
          a.FPDFPage_CloseAnnot(D);
        }
        return a.FPDFPage_GetAnnotCount(P) - 1;
      });
      l.push("a" + p);
    }
    return l;
  }
  reframeAP(n, t, e) {
    const r = this.P, o = this.lib, a = o.readW((h, m) => r.FPDFAnnot_GetAP(n, 0, h, m));
    if (tt(o, n, e), !a) return;
    const s = (e.r - e.l) / Math.max(1e-6, t.r - t.l), i = (e.t - e.b) / Math.max(1e-6, t.t - t.b), l = o.wstr(`q ${Ue(s)} 0 0 ${Ue(i)} ${Ue(e.l - t.l * s)} ${Ue(e.b - t.b * i)} cm
${a}
Q`);
    r.FPDFAnnot_SetAP(n, 0, l), o.free(l);
  }
  isDrawn(n) {
    return this.P.FPDFAnnot_HasKey(n, "MarginAP") || this.P.FPDFAnnot_HasKey(n, "MarginFT");
  }
  moveAnnot(n, t, e, r) {
    const o = this.P, a = this.lib;
    return this.withPage(n, (s) => {
      const i = o.FPDFPage_GetAnnot(s, t);
      try {
        const l = o.FPDFAnnot_GetSubtype(i);
        if ([Q.HIGHLIGHT, Q.UNDERLINE, Q.STRIKEOUT, Q.SQUIGGLY, Q.REDACT].includes(l)) return false;
        if (l === Q.LINE) {
          const _ = this.readLine(i);
          return _ ? (this.writeLine(i, { x: _[0].x + e, y: _[0].y + r }, { x: _[1].x + e, y: _[1].y + r }), this.lineAP(i), true) : false;
        }
        if (l === Q.WIDGET) {
          const _ = ft(a, i);
          return tt(a, i, { l: _.l + e, r: _.r + e, t: _.t + r, b: _.b + r }), true;
        }
        const h = ft(a, i), m = { l: h.l + e, r: h.r + e, t: h.t + r, b: h.b + r };
        if (this.isDrawn(i) ? this.reframeAP(i, h, m) : tt(a, i, m), l === Q.FREETEXT) {
          const _ = (p) => a.readW((P, D) => o.FPDFAnnot_GetStringValue(i, p, P, D));
          try {
            const p = JSON.parse(_("MarginFT")), P = (x) => ({ l: x.l + e, r: x.r + e, t: x.t + r, b: x.b + r });
            p.box = P(p.box), p.tip && (p.tip = { x: p.tip.x + e, y: p.tip.y + r });
            const D = a.wstr(JSON.stringify(p));
            if (o.FPDFAnnot_SetStringValue(i, "MarginFT", D), a.free(D), p.tip) {
              const x = vo(p.box, p.tip), A = a.floats([p.tip.x, p.tip.y, x.x, x.y]);
              o.EPDFAnnot_SetCalloutLine(i, A, 2), a.free(A);
            }
          } catch {
          }
          return true;
        }
        if (l === Q.INK) {
          const _ = o.FPDFAnnot_GetInkListCount(i), p = [];
          for (let P = 0; P < _; P++) {
            const D = o.FPDFAnnot_GetInkListPath(i, P, 0, 0), x = a.alloc(D * 8);
            o.FPDFAnnot_GetInkListPath(i, P, x, D);
            const A = a.readFloats(x, D * 2);
            a.free(x), p.push(A.map((w, k) => w + (k % 2 ? r : e)));
          }
          o.FPDFAnnot_RemoveInkList(i);
          for (const P of p) {
            const D = a.floats(P);
            o.FPDFAnnot_AddInkStroke(i, D, P.length / 2), a.free(D);
          }
        }
        return l !== Q.STAMP && this.regenAP(i), true;
      } finally {
        o.FPDFPage_CloseAnnot(i);
      }
    });
  }
  resizeAnnot(n, t, e) {
    const r = this.P, o = this.lib;
    return this.withPage(n, (a) => {
      const s = r.FPDFPage_GetAnnot(a, t);
      try {
        const i = r.FPDFAnnot_GetSubtype(s);
        if (i === Q.FREETEXT || i === Q.TEXT || i === Q.REDACT || [Q.HIGHLIGHT, Q.UNDERLINE, Q.STRIKEOUT, Q.SQUIGGLY].includes(i)) return false;
        const l = ft(o, s), h = (e.r - e.l) / Math.max(1e-6, l.r - l.l), m = (e.t - e.b) / Math.max(1e-6, l.t - l.b), _ = (p, P) => [e.l + (p - l.l) * h, e.b + (P - l.b) * m];
        if (this.isDrawn(s)) return this.reframeAP(s, l, e), true;
        if (i === Q.WIDGET) {
          tt(o, s, e);
          const p = r.FPDFAnnot_GetFormFieldType(this.form, s);
          if (p === ye.SIGNATURE) {
            const P = o.wstr(qo(e));
            r.FPDFAnnot_SetAP(s, 0, P), o.free(P);
          } else p !== ye.CHECKBOX && p !== ye.RADIO && r.EPDFAnnot_GenerateFormFieldAP(s);
          return true;
        }
        if (i === Q.LINE) {
          const p = this.readLine(s);
          if (!p) return false;
          const [P, D] = p.map((x) => _(x.x, x.y));
          return this.writeLine(s, { x: P[0], y: P[1] }, { x: D[0], y: D[1] }), this.lineAP(s), true;
        }
        if (tt(o, s, e), i === Q.INK) {
          const p = r.FPDFAnnot_GetInkListCount(s), P = [];
          for (let D = 0; D < p; D++) {
            const x = r.FPDFAnnot_GetInkListPath(s, D, 0, 0), A = o.alloc(x * 8);
            r.FPDFAnnot_GetInkListPath(s, D, A, x);
            const w = o.readFloats(A, x * 2);
            o.free(A);
            const k = [];
            for (let G = 0; G < w.length; G += 2) k.push(..._(w[G], w[G + 1]));
            P.push(k);
          }
          r.FPDFAnnot_RemoveInkList(s);
          for (const D of P) {
            const x = o.floats(D);
            r.FPDFAnnot_AddInkStroke(s, x, D.length / 2), o.free(x);
          }
        }
        return i !== Q.STAMP && this.regenAP(s), true;
      } finally {
        r.FPDFPage_CloseAnnot(s);
      }
    });
  }
  pageObjects(n) {
    const t = this.P, e = this.lib;
    return this.withPage(n, (r) => {
      const o = [], a = t.FPDFPage_CountObjects(r);
      for (let s = 0; s < a; s++) {
        const i = t.FPDFPage_GetObject(r, s), l = t.FPDFPageObj_GetType(i), h = rn(e, i, "MarginText") || rn(e, i, "MarginGlyph");
        if (!h && l !== 1 && l !== 3 && l !== 5) continue;
        const m = e.tmp((_) => {
          const p = _(16);
          t.FPDFPageObj_GetBounds(i, p, p + 4, p + 8, p + 12);
          const [P, D, x, A] = e.readFloats(p, 4);
          return { l: P, b: D, r: x, t: A };
        });
        o.push({ index: s, type: l, bounds: m, blockId: h?.id || "" });
      }
      return o;
    });
  }
  transformObjects(n, t, e) {
    const r = this.P, o = this.lib;
    this.withPage(n, (a) => {
      const s = t.map((l) => r.FPDFPage_GetObject(a, l)).filter(Boolean), i = o.floats(e);
      for (const l of s) r.FPDFPageObj_TransformF(l, i);
      o.free(i), r.FPDFPage_GenerateContent(a);
    });
  }
  transformBlock(n, t, e, r) {
    const o = this.P, a = this.lib;
    this.withPage(n, (s) => {
      const i = a.floats(e);
      for (let l = 0; l < o.FPDFPage_CountObjects(s); l++) {
        const h = o.FPDFPage_GetObject(s, l), m = rn(a, h, "MarginText") || rn(a, h, "MarginGlyph");
        if (!m || m.id !== t) continue;
        o.FPDFPageObj_TransformF(h, i);
        const _ = rn(a, h, "MarginText");
        if (_) {
          const p = zi(a, h, "MarginText");
          if (!p) continue;
          if (_.bm) {
            const [P, D, x, A, w, k] = _.bm, G = e[0] * w + e[2] * k + e[4], E = e[1] * w + e[3] * k + e[5];
            o.FPDFPageObjMark_SetStringParam(this.h, h, p, "bm", [P, D, x, A, G, E].map((B) => +B.toFixed(4)).join(","));
          }
          if (r !== 1 && _.size && o.FPDFPageObjMark_SetStringParam(this.h, h, p, "size", String(+(_.size * r).toFixed(2))), _.rt) try {
            const P = JSON.parse(decodeURIComponent(_.rt)), [D, x, A, w, k, G] = P.bm;
            P.bm = [D, x, A, w, +(e[0] * k + e[2] * G + e[4]).toFixed(4), +(e[1] * k + e[3] * G + e[5]).toFixed(4)], r !== 1 && (P.size = +(P.size * r).toFixed(2), P.width && (P.width = +(P.width * r).toFixed(2))), o.FPDFPageObjMark_SetStringParam(this.h, h, p, "rt", encodeURIComponent(JSON.stringify(P)));
          } catch {
          }
        }
      }
      a.free(i), o.FPDFPage_GenerateContent(s);
    });
  }
  fields(n) {
    const t = this.P, e = this.lib, r = this.form;
    return r ? this.withPage(n, (o) => {
      const a = [], s = t.FPDFPage_GetAnnotCount(o);
      for (let i = 0; i < s; i++) {
        const l = t.FPDFPage_GetAnnot(o, i);
        try {
          if (t.FPDFAnnot_GetSubtype(l) !== Q.WIDGET) continue;
          const h = t.FPDFAnnot_GetFormFieldType(r, l);
          if (h <= 0) continue;
          const m = t.FPDFAnnot_GetFormFieldFlags(r, l), _ = [];
          if (h === ye.COMBO || h === ye.LIST) {
            const p = t.FPDFAnnot_GetOptionCount(r, l);
            for (let P = 0; P < p; P++) _.push({ label: e.readW((D, x) => t.FPDFAnnot_GetOptionLabel(r, l, P, D, x)), selected: !!t.FPDFAnnot_IsOptionSelected(r, l, P) });
          }
          a.push({ index: i, type: h, rect: ft(e, l), options: _, name: e.readW((p, P) => t.FPDFAnnot_GetFormFieldName(r, l, p, P)), value: e.readW((p, P) => t.FPDFAnnot_GetFormFieldValue(r, l, p, P)), checked: h === ye.CHECKBOX || h === ye.RADIO ? !!t.FPDFAnnot_IsChecked(r, l) : false, readOnly: !!(m & 1), multiline: h === ye.TEXT && !!(m & 4096), exportValue: h === ye.CHECKBOX || h === ye.RADIO ? e.readW((p, P) => t.FPDFAnnot_GetFormFieldExportValue(r, l, p, P)) : "" });
        } finally {
          t.FPDFPage_CloseAnnot(l);
        }
      }
      return a;
    }) : [];
  }
  createField(n, t, e, r, o = {}) {
    const a = this.P, s = this.lib, i = this.form;
    if (!i) throw new Error("Form fields aren’t available for this document");
    const l = { text: ye.TEXT, multiline: ye.TEXT, signature: ye.TEXT, checkbox: ye.CHECKBOX, radio: ye.RADIO, dropdown: ye.COMBO, list: ye.LIST }[t];
    let h = o.joinTo || null;
    if (t === "radio" && !h) for (let _ = 0; _ < this.pageCount && !h; _++) {
      const p = this.fields(_).find((P) => P.type === ye.RADIO && P.name === r);
      p && (h = { page: _, annot: p.index });
    }
    const m = h && h.page !== n ? a.FPDF_LoadPage(this.h, h.page) : 0;
    m && a.FORM_OnAfterLoadPage(m, i), this.depth++;
    try {
      return this.withPage(n, (_) => {
        const p = s.wstr(h ? r + "__margin_new" : r), P = a.EPDFPage_CreateFormField(_, i, l, p);
        if (s.free(p), !P) throw new Error("Could not create the field");
        try {
          if (tt(s, P, e), a.FPDFAnnot_SetFlags(P, 4), a.FPDFAnnot_SetBorder(P, 0, 0, 1), a.EPDFAnnot_SetMKColor(P, 0, 120, 124, 134), t !== "checkbox" && t !== "radio" && t !== "signature" && a.EPDFAnnot_SetMKColor(P, 1, 255, 255, 255), a.EPDFAnnot_SetDefaultAppearance(P, 4, o.size ?? (t === "checkbox" || t === "radio" ? 0 : 11), 0, 0, 0), t === "multiline" && a.FPDFAnnot_SetFormFieldFlags(i, P, 4096), (t === "dropdown" || t === "list") && o.options?.length) {
            const D = o.options.map((A) => s.wstr(A)), x = s.alloc(D.length * 4);
            D.forEach((A, w) => s.M.setValue(x + w * 4, A, "i32")), a.EPDFAnnot_SetFormFieldOptions(i, P, x, D.length), D.forEach((A) => s.free(A)), s.free(x);
          }
          if (t === "radio") {
            if (h) {
              const x = a.FPDFPage_GetAnnot(m || _, h.annot);
              try {
                if (!a.EPDFAnnot_ShareFormField(i, x, P)) throw new Error("Could not add the button to its group");
              } finally {
                a.FPDFPage_CloseAnnot(x);
              }
              const A = s.wstr(r);
              a.EPDFAnnot_SetFormFieldName(i, P, A), s.free(A);
            }
            const D = s.wstr((o.onValue || "Choice").slice(0, 24) + " ".repeat(60));
            a.FPDFAnnot_SetStringValue(P, "MarginOn", D), s.free(D);
          }
          if (a.EPDFAnnot_GenerateFormFieldAP(P), t === "signature") {
            const D = s.wstr(" ".repeat(40));
            a.FPDFAnnot_SetStringValue(P, "MarginSig", D), s.free(D), a.FPDFAnnot_SetFormFieldFlags(i, P, 1 << 23);
            const x = s.wstr(qo(e));
            a.FPDFAnnot_SetAP(P, 0, x), s.free(x);
          }
        } finally {
          a.FPDFPage_CloseAnnot(P);
        }
        return a.FPDFPage_GetAnnotCount(_) - 1;
      });
    } finally {
      this.depth--, m && (a.FORM_OnBeforeClosePage(m, i), a.FPDF_ClosePage(m));
    }
  }
  removeWidgets(n) {
    const t = this.P;
    this.withPage(n, (e) => {
      for (let r = t.FPDFPage_GetAnnotCount(e) - 1; r >= 0; r--) {
        const o = t.FPDFPage_GetAnnot(e, r), a = t.FPDFAnnot_GetSubtype(o) === Q.WIDGET;
        t.FPDFPage_CloseAnnot(o), a && t.FPDFPage_RemoveAnnot(e, r);
      }
    });
  }
  setFieldName(n, t, e) {
    const r = this.P, o = this.lib;
    return this.withPage(n, (a) => {
      const s = r.FPDFPage_GetAnnot(a, t);
      try {
        const i = o.wstr(e), l = r.EPDFAnnot_SetFormFieldName(this.form, s, i);
        return o.free(i), !!l;
      } finally {
        r.FPDFPage_CloseAnnot(s);
      }
    });
  }
  setFieldOptions(n, t, e) {
    const r = this.P, o = this.lib;
    this.withPage(n, (a) => {
      const s = r.FPDFPage_GetAnnot(a, t);
      try {
        const i = e.map((h) => o.wstr(h)), l = o.alloc(Math.max(1, i.length) * 4);
        i.forEach((h, m) => o.M.setValue(l + m * 4, h, "i32")), r.EPDFAnnot_SetFormFieldOptions(this.form, s, l, i.length), i.forEach((h) => o.free(h)), o.free(l), r.EPDFAnnot_GenerateFormFieldAP(s);
      } finally {
        r.FPDFPage_CloseAnnot(s);
      }
    });
  }
  setFieldText(n, t, e) {
    const r = this.P, o = this.lib, a = this.form;
    this.withPage(n, (s) => {
      const i = r.FPDFPage_GetAnnot(s, t);
      try {
        r.FORM_SetFocusedAnnot(a, i), r.FORM_SelectAllText(a, s);
        const l = o.wstr(e);
        r.FORM_ReplaceSelection(a, s, l), o.free(l), r.FORM_ForceToKillFocus(a);
      } finally {
        r.FPDFPage_CloseAnnot(i);
      }
    });
  }
  fieldLook(n, t) {
    const e = this.P, r = this.lib;
    return this.withPage(n, (o) => {
      const a = e.FPDFPage_GetAnnot(o, t);
      try {
        return r.tmp((s) => {
          const i = s(12), l = (A) => e.EPDFAnnot_GetMKColor(a, A, i, i + 4, i + 8) ? r.readU32(i, 3) : null, h = s(4), m = e.FPDFAnnot_GetFontSize(this.form, a, h) ? r.readFloats(h, 1)[0] : 0, _ = s(4), p = s(4), P = s(4), D = e.FPDFAnnot_GetBorder(a, _, p, P) ? r.readFloats(P, 1)[0] : 1, x = e.FPDFAnnot_GetFormFieldFlags(this.form, a);
          return { rect: ft(r, a), border: l(0), background: l(1), size: m, borderWidth: D, multiline: !!(x & 4096) };
        });
      } finally {
        e.FPDFPage_CloseAnnot(a);
      }
    });
  }
  setNormalAppearance(n, t, e) {
    const r = this.P, o = this.lib;
    return this.withPage(n, (a) => {
      const s = r.FPDFPage_GetAnnot(a, t);
      try {
        const i = o.wstr(e), l = !!r.FPDFAnnot_SetAP(s, 0, i);
        return o.free(i), l;
      } finally {
        r.FPDFPage_CloseAnnot(s);
      }
    });
  }
  clickField(n, t) {
    const e = this.P, r = this.lib;
    this.withPage(n, (o) => {
      const a = e.FPDFPage_GetAnnot(o, t);
      try {
        const s = ft(r, a), i = (s.l + s.r) / 2, l = (s.t + s.b) / 2;
        e.FORM_OnMouseMove(this.form, o, 0, i, l), e.FORM_OnLButtonDown(this.form, o, 0, i, l), e.FORM_OnLButtonUp(this.form, o, 0, i, l), e.FORM_ForceToKillFocus(this.form);
      } finally {
        e.FPDFPage_CloseAnnot(a);
      }
    });
  }
  selectOption(n, t, e) {
    const r = this.P;
    this.withPage(n, (o) => {
      const a = r.FPDFPage_GetAnnot(o, t);
      try {
        r.FORM_SetFocusedAnnot(this.form, a), r.FORM_SetIndexSelected(this.form, o, e, true), r.FORM_ForceToKillFocus(this.form);
      } finally {
        r.FPDFPage_CloseAnnot(a);
      }
    });
  }
}
class yt {
  constructor(n, t, e, r, o, a) {
    this.a = n, this.b = t, this.c = e, this.d = r, this.e = o, this.f = a;
  }
  apply(n, t) {
    return [this.a * n + this.c * t + this.e, this.b * n + this.d * t + this.f];
  }
  invert() {
    const n = this.a * this.d - this.b * this.c, t = this.d / n, e = -this.b / n, r = -this.c / n, o = this.a / n;
    return new yt(t, e, r, o, -(t * this.e + r * this.f), -(e * this.e + o * this.f));
  }
  box(n) {
    const t = [this.apply(n.l, n.b), this.apply(n.r, n.t), this.apply(n.l, n.t), this.apply(n.r, n.b)], e = t.map((s) => s[0]), r = t.map((s) => s[1]), o = Math.min(...e), a = Math.min(...r);
    return { x: o, y: a, w: Math.max(...e) - o, h: Math.max(...r) - a };
  }
}
function ft(u, n) {
  return u.tmp((t) => {
    const e = t(16);
    u.P.FPDFAnnot_GetRect(n, e);
    const [r, o, a, s] = u.readFloats(e, 4);
    return { l: Math.min(r, a), r: Math.max(r, a), t: Math.max(o, s), b: Math.min(o, s) };
  });
}
function vo(u, n) {
  const t = (u.l + u.r) / 2, e = (u.b + u.t) / 2, r = n.x - t, o = n.y - e, a = (u.r - u.l) / 2, s = (u.t - u.b) / 2, i = Math.min(r ? a / Math.abs(r) : 1 / 0, o ? s / Math.abs(o) : 1 / 0);
  return i >= 1 ? { x: n.x, y: n.y } : { x: t + r * i, y: e + o * i };
}
function tt(u, n, t) {
  const e = u.floats([t.l, t.t, t.r, t.b]);
  u.P.FPDFAnnot_SetRect(n, e), u.free(e);
}
function Jt(u) {
  return { l: Math.min(...u.map((n) => n.l)), r: Math.max(...u.map((n) => n.r)), b: Math.min(...u.map((n) => n.b)), t: Math.max(...u.map((n) => n.t)) };
}
function _r(u = /* @__PURE__ */ new Date()) {
  const n = (t) => String(t).padStart(2, "0");
  return `D:${u.getFullYear()}${n(u.getMonth() + 1)}${n(u.getDate())}${n(u.getHours())}${n(u.getMinutes())}${n(u.getSeconds())}`;
}
function zi(u, n, t) {
  const e = u.P, r = e.FPDFPageObj_CountMarks(n);
  for (let o = 0; o < r; o++) {
    const a = e.FPDFPageObj_GetMark(n, o);
    if (u.tmp((i) => {
      const l = i(128), h = i(4);
      return e.FPDFPageObjMark_GetName(a, l, 128, h) && u.M.UTF16ToString(l) === t;
    })) return a;
  }
  return 0;
}
function rn(u, n, t) {
  const e = u.P, r = e.FPDFPageObj_CountMarks(n);
  for (let o = 0; o < r; o++) {
    const a = e.FPDFPageObj_GetMark(n, o), s = u.tmp((i) => {
      const l = i(128), h = i(4);
      if (!e.FPDFPageObjMark_GetName(a, l, 128, h) || u.M.UTF16ToString(l) !== t) return null;
      const m = (P) => {
        const D = i(512);
        return e.FPDFPageObjMark_GetParamStringValue(a, P, D, 512, h) ? u.M.UTF16ToString(D) : "";
      }, _ = m("bm").split(",").map(Number);
      let p = "";
      if (e.FPDFPageObjMark_GetParamStringValue(a, "rt", 0, 0, h)) {
        const P = u.M.getValue(h, "i32") >>> 0;
        if (P > 2) {
          const D = u.alloc(P);
          e.FPDFPageObjMark_GetParamStringValue(a, "rt", D, P, h), p = u.M.UTF16ToString(D), u.free(D);
        }
      }
      return { id: m("id"), font: m("font"), ln: +m("ln") || 0, size: +m("size") || 0, color: m("color"), lh: +m("lh") || 1.5, st: m("st"), al: m("al") || "left", bm: _.length === 6 && _.every(Number.isFinite) ? _ : null, rt: p };
    });
    if (s) return s;
  }
  return null;
}
const xo = 4294967295;
function Vr(u, n) {
  const t = ArrayBuffer;
  if (typeof t.prototype.resize == "function") for (const e of [n, u * 2 + (64 << 20), u + (256 << 20), u + (16 << 20)]) {
    const r = Math.min(xo, Math.max(u, e));
    try {
      return new t(u, { maxByteLength: r });
    } catch {
    }
  }
  return new ArrayBuffer(u);
}
class Yt {
  buf;
  len;
  constructor(n, t) {
    this.buf = n, this.len = t;
  }
  static from(n) {
    const t = Vr(n.length, n.length * 2 + 67108864);
    return new Uint8Array(t, 0, n.length).set(n), new Yt(t, n.length);
  }
  static async fromFile(n) {
    if (n.size > xo) throw new Error("Files over 4 GB can’t be opened");
    const t = Vr(n.size, n.size * 2 + (64 << 20)), e = new Uint8Array(t, 0, n.size);
    let r = 0;
    const o = n.stream().getReader();
    for (; ; ) {
      const { done: a, value: s } = await o.read();
      if (a) break;
      e.set(s.subarray(0, Math.max(0, n.size - r)), r), r += s.length;
    }
    if (r !== n.size) throw new Error("The file changed while it was being read");
    return new Yt(t, n.size);
  }
  view(n = this.len) {
    return new Uint8Array(this.buf, 0, n);
  }
  writeAt(n, t) {
    const e = n + t.length;
    if (e > xo) throw new Error("This document has grown past 4 GB");
    const r = this.buf;
    if (e > r.byteLength) if (r.resizable && e <= r.maxByteLength) r.resize(Math.min(r.maxByteLength, Math.max(e, r.byteLength + (1 << 20))));
    else {
      const o = Vr(e, e * 2 + 67108864);
      new Uint8Array(o, 0, n).set(new Uint8Array(this.buf, 0, n)), o.byteLength < e && o.resize?.(e), this.buf = o;
    }
    new Uint8Array(this.buf, n, t.length).set(t), this.len = e;
  }
}
const Hi = "modulepreload", Wi = function(u, n) {
  return new URL(u, n).href;
}, Jo = {}, Vi = function(n, t, e) {
  let r = Promise.resolve();
  if (t && t.length > 0) {
    let a = function(h) {
      return Promise.all(h.map((m) => Promise.resolve(m).then((_) => ({ status: "fulfilled", value: _ }), (_) => ({ status: "rejected", reason: _ }))));
    };
    const s = document.getElementsByTagName("link"), i = document.querySelector("meta[property=csp-nonce]"), l = i?.nonce || i?.getAttribute("nonce");
    r = a(t.map((h) => {
      if (h = Wi(h, e), h in Jo) return;
      Jo[h] = true;
      const m = h.endsWith(".css"), _ = m ? '[rel="stylesheet"]' : "";
      if (!!e) for (let D = s.length - 1; D >= 0; D--) {
        const x = s[D];
        if (x.href === h && (!m || x.rel === "stylesheet")) return;
      }
      else if (document.querySelector(`link[href="${h}"]${_}`)) return;
      const P = document.createElement("link");
      if (P.rel = m ? "stylesheet" : Hi, m || (P.as = "script"), P.crossOrigin = "", P.href = h, l && P.setAttribute("nonce", l), document.head.appendChild(P), m) return new Promise((D, x) => {
        P.addEventListener("load", D), P.addEventListener("error", () => x(new Error(`Unable to preload CSS for ${h}`)));
      });
    }));
  }
  function o(a) {
    const s = new Event("vite:preloadError", { cancelable: true });
    if (s.payload = a, window.dispatchEvent(s), !s.defaultPrevented) throw a;
  }
  return r.then((a) => {
    for (const s of a || []) s.status === "rejected" && o(s.reason);
    return n().catch(o);
  });
};
async function Ki(u = {}) {
  var n, t = u, e = typeof window == "object", r = typeof WorkerGlobalScope < "u", o = typeof process == "object" && process.versions?.node && process.type != "renderer";
  if (o) {
    const { createRequire: M } = await Vi(() => Promise.resolve().then(() => xu), void 0, import.meta.url);
    var a = M(import.meta.url);
  }
  var s = (M, he) => {
    throw he;
  }, i = import.meta.url, l = "";
  function h(M) {
    return t.locateFile ? t.locateFile(M, l) : l + M;
  }
  var m, _;
  if (o) {
    var p = a("fs");
    i.startsWith("file:") && (l = a("path").dirname(a("url").fileURLToPath(i)) + "/"), _ = (M) => {
      M = w(M) ? new URL(M) : M;
      var he = p.readFileSync(M);
      return he;
    }, m = async (M, he = true) => {
      M = w(M) ? new URL(M) : M;
      var ve = p.readFileSync(M, he ? void 0 : "utf8");
      return ve;
    }, process.argv.length > 1 && process.argv[1].replace(/\\/g, "/"), process.argv.slice(2), s = (M, he) => {
      throw process.exitCode = M, he;
    };
  } else if (e || r) {
    try {
      l = new URL(".", i).href;
    } catch {
    }
    r && (_ = (M) => {
      var he = new XMLHttpRequest();
      return he.open("GET", M, false), he.responseType = "arraybuffer", he.send(null), new Uint8Array(he.response);
    }), m = async (M) => {
      if (w(M)) return new Promise((ve, Re) => {
        var Ne = new XMLHttpRequest();
        Ne.open("GET", M, true), Ne.responseType = "arraybuffer", Ne.onload = () => {
          if (Ne.status == 200 || Ne.status == 0 && Ne.response) {
            ve(Ne.response);
            return;
          }
          Re(Ne.status);
        }, Ne.onerror = Re, Ne.send(null);
      });
      var he = await fetch(M, { credentials: "same-origin" });
      if (he.ok) return he.arrayBuffer();
      throw new Error(he.status + " : " + he.url);
    };
  }
  console.log.bind(console);
  var P = console.error.bind(console), D, x = false, A, w = (M) => M.startsWith("file://"), k, G, E, B, z = false;
  function O() {
    var M = E.buffer;
    t.HEAP8 = new Int8Array(M), t.HEAPU8 = B = new Uint8Array(M), t.HEAPU16 = new Uint16Array(M), t.HEAP32 = new Int32Array(M), t.HEAPU32 = new Uint32Array(M), t.HEAPF32 = new Float32Array(M), new BigInt64Array(M), new BigUint64Array(M);
  }
  function W() {
    if (t.preRun) for (typeof t.preRun == "function" && (t.preRun = [t.preRun]); t.preRun.length; ) Xe(t.preRun.shift());
    Ce(Ke);
  }
  function N() {
    z = true, He.__wasm_call_ctors();
  }
  function V() {
    if (t.postRun) for (typeof t.postRun == "function" && (t.postRun = [t.postRun]); t.postRun.length; ) Oe(t.postRun.shift());
    Ce(Ee);
  }
  var q = 0, Y = null;
  function ne(M) {
    q++, t.monitorRunDependencies?.(q);
  }
  function J(M) {
    if (q--, t.monitorRunDependencies?.(q), q == 0 && Y) {
      var he = Y;
      Y = null, he();
    }
  }
  function ee(M) {
    t.onAbort?.(M), M = "Aborted(" + M + ")", P(M), x = true, M += ". Build with -sASSERTIONS for more info.";
    var he = new WebAssembly.RuntimeError(M);
    throw G?.(he), he;
  }
  var ae;
  function de() {
    return t.locateFile ? h("harfbuzz.wasm") : new URL("harfbuzz.wasm", document.baseURI).href;
  }
  function oe(M) {
    if (M == ae && D) return new Uint8Array(D);
    if (_) return _(M);
    throw "both async and sync fetching of the wasm failed";
  }
  async function fe(M) {
    if (!D) try {
      var he = await m(M);
      return new Uint8Array(he);
    } catch {
    }
    return oe(M);
  }
  async function we(M, he) {
    try {
      var ve = await fe(M), Re = await WebAssembly.instantiate(ve, he);
      return Re;
    } catch (Ne) {
      P(`failed to asynchronously prepare wasm: ${Ne}`), ee(Ne);
    }
  }
  async function ce(M, he, ve) {
    if (!M && !w(he) && !o) try {
      var Re = fetch(he, { credentials: "same-origin" }), Ne = await WebAssembly.instantiateStreaming(Re, ve);
      return Ne;
    } catch (ot) {
      P(`wasm streaming compile failed: ${ot}`), P("falling back to ArrayBuffer instantiation");
    }
    return we(he, ve);
  }
  function Ge() {
    return { env: dn, wasi_snapshot_preview1: dn };
  }
  async function ge() {
    function M(ot, Lt) {
      return He = ot.exports, t.wasmExports = He, E = He.memory, O(), ct = He.__indirect_function_table, qe(He), J(), He;
    }
    ne();
    function he(ot) {
      return M(ot.instance);
    }
    var ve = Ge();
    if (t.instantiateWasm) return new Promise((ot, Lt) => {
      t.instantiateWasm(ve, (Ae, kn) => {
        ot(M(Ae));
      });
    });
    ae ??= de();
    var Re = await ce(D, ae, ve), Ne = he(Re);
    return Ne;
  }
  class $e {
    name = "ExitStatus";
    constructor(he) {
      this.message = `Program terminated with exit(${he})`, this.status = he;
    }
  }
  var Ce = (M) => {
    for (; M.length > 0; ) M.shift()(t);
  }, Ee = [], Oe = (M) => Ee.push(M), Ke = [], Xe = (M) => Ke.push(M), dt = true, Rt = (M) => Gt(M), It = () => Be(), Le = () => ee(""), Ut = 0, St = () => {
    dt = false, Ut = 0;
  }, Qe = {}, f = (M) => {
    if (M instanceof $e || M == "unwind") return A;
    s(1, M);
  }, Ct = () => dt || Ut > 0, wt = (M) => {
    A = M, Ct() || (t.onExit?.(M), x = true), s(M, new $e(M));
  }, Dn = (M, he) => {
    A = M, wt(M);
  }, jn = Dn, yn = () => {
    if (!Ct()) try {
      jn(A);
    } catch (M) {
      f(M);
    }
  }, zt = (M) => {
    if (!x) try {
      M(), yn();
    } catch (he) {
      f(he);
    }
  }, bt = () => performance.now(), Bn = (M, he) => {
    if (Qe[M] && (clearTimeout(Qe[M].id), delete Qe[M]), !he) return 0;
    var ve = setTimeout(() => {
      delete Qe[M], zt(() => An(M, bt()));
    }, he);
    return Qe[M] = { id: ve, timeout_ms: he }, 0;
  }, be = () => 2147483648, je = (M, he) => Math.ceil(M / he) * he, mt = (M) => {
    var he = E.buffer.byteLength, ve = (M - he + 65535) / 65536 | 0;
    try {
      return E.grow(ve), O(), 1;
    } catch {
    }
  }, wn = (M) => {
    var he = B.length;
    M >>>= 0;
    var ve = be();
    if (M > ve) return false;
    for (var Re = 1; Re <= 4; Re *= 2) {
      var Ne = he * (1 + 0.2 / Re);
      Ne = Math.min(Ne, M + 100663296);
      var ot = Math.min(ve, je(Math.max(M, Ne), 65536)), Lt = mt(ot);
      if (Lt) return true;
    }
    return false;
  }, Qt = (M) => {
    const he = M.length;
    return [he % 128 | 128, he >> 7, ...M];
  }, vn = { i: 127, p: 127, j: 126, f: 125, d: 124, e: 111 }, cn = (M) => Qt(Array.from(M, (he) => {
    var ve = vn[he];
    return ve;
  })), xn = (M, he) => {
    var ve = Uint8Array.of(0, 97, 115, 109, 1, 0, 0, 0, 1, ...Qt([1, 96, ...cn(he.slice(1)), ...cn(he[0] === "v" ? "" : he[0])]), 2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0), Re = new WebAssembly.Module(ve), Ne = new WebAssembly.Instance(Re, { e: { f: M } }), ot = Ne.exports.f;
    return ot;
  }, ct, Mt = (M) => ct.get(M), un = (M, he) => {
    if (st) for (var ve = M; ve < M + he; ve++) {
      var Re = Mt(ve);
      Re && st.set(Re, ve);
    }
  }, st, en = (M) => (st || (st = /* @__PURE__ */ new WeakMap(), un(0, ct.length)), st.get(M) || 0), rt = [], ut = () => rt.length ? rt.pop() : ct.grow(1), ht = (M, he) => ct.set(M, he), hn = (M, he) => {
    var ve = en(M);
    if (ve) return ve;
    var Re = ut();
    try {
      ht(Re, M);
    } catch (ot) {
      if (!(ot instanceof TypeError)) throw ot;
      var Ne = xn(M, he);
      ht(Re, Ne);
    }
    return st.set(M, Re), Re;
  }, vt = (M) => {
    st.delete(Mt(M)), ht(M, null), rt.push(M);
  }, xt = (M) => At(M);
  t.noExitRuntime && (dt = t.noExitRuntime), t.print && t.print, t.printErr && (P = t.printErr), t.wasmBinary && (D = t.wasmBinary), t.arguments && t.arguments, t.thisProgram && t.thisProgram, t.wasmExports = He, t.stackSave = It, t.stackRestore = Rt, t.stackAlloc = xt, t.addFunction = hn, t.removeFunction = vt;
  var An, Gt, At, Be;
  function qe(M) {
    t._hb_blob_create = M.hb_blob_create, t._hb_blob_destroy = M.hb_blob_destroy, t._hb_blob_get_length = M.hb_blob_get_length, t._hb_blob_get_data = M.hb_blob_get_data, t._hb_buffer_serialize = M.hb_buffer_serialize, t._hb_buffer_create = M.hb_buffer_create, t._hb_buffer_reset = M.hb_buffer_reset, t._hb_buffer_reference = M.hb_buffer_reference, t._hb_buffer_destroy = M.hb_buffer_destroy, t._hb_buffer_get_content_type = M.hb_buffer_get_content_type, t._hb_buffer_set_direction = M.hb_buffer_set_direction, t._hb_buffer_set_script = M.hb_buffer_set_script, t._hb_buffer_set_language = M.hb_buffer_set_language, t._hb_buffer_set_flags = M.hb_buffer_set_flags, t._hb_buffer_set_cluster_level = M.hb_buffer_set_cluster_level, t._hb_buffer_clear_contents = M.hb_buffer_clear_contents, t._hb_buffer_add = M.hb_buffer_add, t._hb_buffer_get_length = M.hb_buffer_get_length, t._hb_buffer_get_glyph_infos = M.hb_buffer_get_glyph_infos, t._hb_buffer_get_glyph_positions = M.hb_buffer_get_glyph_positions, t._hb_glyph_info_get_glyph_flags = M.hb_glyph_info_get_glyph_flags, t._hb_buffer_guess_segment_properties = M.hb_buffer_guess_segment_properties, t._hb_buffer_add_utf8 = M.hb_buffer_add_utf8, t._hb_buffer_add_utf16 = M.hb_buffer_add_utf16, t._hb_buffer_add_codepoints = M.hb_buffer_add_codepoints, t._hb_buffer_set_message_func = M.hb_buffer_set_message_func, t._hb_language_from_string = M.hb_language_from_string, t._hb_language_to_string = M.hb_language_to_string, t._hb_script_from_string = M.hb_script_from_string, t._hb_version = M.hb_version, t._hb_version_string = M.hb_version_string, t._hb_feature_from_string = M.hb_feature_from_string, t._hb_feature_to_string = M.hb_feature_to_string, t._hb_variation_from_string = M.hb_variation_from_string, t._hb_variation_to_string = M.hb_variation_to_string, t._malloc = M.malloc, t._free = M.free, t._hb_draw_funcs_set_move_to_func = M.hb_draw_funcs_set_move_to_func, t._hb_draw_funcs_set_line_to_func = M.hb_draw_funcs_set_line_to_func, t._hb_draw_funcs_set_quadratic_to_func = M.hb_draw_funcs_set_quadratic_to_func, t._hb_draw_funcs_set_cubic_to_func = M.hb_draw_funcs_set_cubic_to_func, t._hb_draw_funcs_set_close_path_func = M.hb_draw_funcs_set_close_path_func, t._hb_draw_funcs_create = M.hb_draw_funcs_create, t._hb_draw_funcs_destroy = M.hb_draw_funcs_destroy, t._hb_face_create = M.hb_face_create, t._hb_face_reference = M.hb_face_reference, t._hb_face_destroy = M.hb_face_destroy, t._hb_face_reference_table = M.hb_face_reference_table, t._hb_face_get_upem = M.hb_face_get_upem, t._hb_face_collect_unicodes = M.hb_face_collect_unicodes, t._hb_font_funcs_create = M.hb_font_funcs_create, t._hb_font_funcs_destroy = M.hb_font_funcs_destroy, t._hb_font_funcs_set_font_h_extents_func = M.hb_font_funcs_set_font_h_extents_func, t._hb_font_funcs_set_font_v_extents_func = M.hb_font_funcs_set_font_v_extents_func, t._hb_font_funcs_set_nominal_glyph_func = M.hb_font_funcs_set_nominal_glyph_func, t._hb_font_funcs_set_nominal_glyphs_func = M.hb_font_funcs_set_nominal_glyphs_func, t._hb_font_funcs_set_variation_glyph_func = M.hb_font_funcs_set_variation_glyph_func, t._hb_font_funcs_set_glyph_h_advance_func = M.hb_font_funcs_set_glyph_h_advance_func, t._hb_font_funcs_set_glyph_v_advance_func = M.hb_font_funcs_set_glyph_v_advance_func, t._hb_font_funcs_set_glyph_h_advances_func = M.hb_font_funcs_set_glyph_h_advances_func, t._hb_font_funcs_set_glyph_v_advances_func = M.hb_font_funcs_set_glyph_v_advances_func, t._hb_font_funcs_set_glyph_h_origin_func = M.hb_font_funcs_set_glyph_h_origin_func, t._hb_font_funcs_set_glyph_v_origin_func = M.hb_font_funcs_set_glyph_v_origin_func, t._hb_font_funcs_set_glyph_h_kerning_func = M.hb_font_funcs_set_glyph_h_kerning_func, t._hb_font_funcs_set_glyph_extents_func = M.hb_font_funcs_set_glyph_extents_func, t._hb_font_funcs_set_glyph_name_func = M.hb_font_funcs_set_glyph_name_func, t._hb_font_funcs_set_glyph_from_name_func = M.hb_font_funcs_set_glyph_from_name_func, t._hb_font_get_h_extents = M.hb_font_get_h_extents, t._hb_font_get_v_extents = M.hb_font_get_v_extents, t._hb_font_get_glyph = M.hb_font_get_glyph, t._hb_font_get_nominal_glyph = M.hb_font_get_nominal_glyph, t._hb_font_get_variation_glyph = M.hb_font_get_variation_glyph, t._hb_font_get_glyph_h_advance = M.hb_font_get_glyph_h_advance, t._hb_font_get_glyph_v_advance = M.hb_font_get_glyph_v_advance, t._hb_font_get_glyph_h_origin = M.hb_font_get_glyph_h_origin, t._hb_font_get_glyph_v_origin = M.hb_font_get_glyph_v_origin, t._hb_font_get_glyph_extents = M.hb_font_get_glyph_extents, t._hb_font_get_glyph_from_name = M.hb_font_get_glyph_from_name, t._hb_font_draw_glyph_or_fail = M.hb_font_draw_glyph_or_fail, t._hb_font_paint_glyph_or_fail = M.hb_font_paint_glyph_or_fail, t._hb_font_draw_glyph = M.hb_font_draw_glyph, t._hb_font_paint_glyph = M.hb_font_paint_glyph, t._hb_font_glyph_to_string = M.hb_font_glyph_to_string, t._hb_font_create = M.hb_font_create, t._hb_font_set_variations = M.hb_font_set_variations, t._hb_font_create_sub_font = M.hb_font_create_sub_font, t._hb_font_reference = M.hb_font_reference, t._hb_font_destroy = M.hb_font_destroy, t._hb_font_get_face = M.hb_font_get_face, t._hb_font_set_funcs = M.hb_font_set_funcs, t._hb_font_set_scale = M.hb_font_set_scale, t._hb_ot_color_has_palettes = M.hb_ot_color_has_palettes, t._hb_ot_color_palette_get_count = M.hb_ot_color_palette_get_count, t._hb_ot_color_palette_get_name_id = M.hb_ot_color_palette_get_name_id, t._hb_ot_color_palette_color_get_name_id = M.hb_ot_color_palette_color_get_name_id, t._hb_ot_color_palette_get_flags = M.hb_ot_color_palette_get_flags, t._hb_ot_color_palette_get_colors = M.hb_ot_color_palette_get_colors, t._hb_ot_color_has_layers = M.hb_ot_color_has_layers, t._hb_ot_color_has_paint = M.hb_ot_color_has_paint, t._hb_ot_color_glyph_has_paint = M.hb_ot_color_glyph_has_paint, t._hb_ot_color_glyph_get_layers = M.hb_ot_color_glyph_get_layers, t._hb_ot_color_has_png = M.hb_ot_color_has_png, t._hb_ot_color_glyph_reference_png = M.hb_ot_color_glyph_reference_png, t._hb_ot_layout_get_glyph_class = M.hb_ot_layout_get_glyph_class, t._hb_ot_layout_get_ligature_carets = M.hb_ot_layout_get_ligature_carets, t._hb_ot_layout_table_get_script_tags = M.hb_ot_layout_table_get_script_tags, t._hb_ot_layout_table_get_feature_tags = M.hb_ot_layout_table_get_feature_tags, t._hb_ot_layout_script_get_language_tags = M.hb_ot_layout_script_get_language_tags, t._hb_ot_layout_language_get_feature_tags = M.hb_ot_layout_language_get_feature_tags, t._hb_ot_layout_feature_get_lookups = M.hb_ot_layout_feature_get_lookups, t._hb_ot_layout_feature_get_name_ids = M.hb_ot_layout_feature_get_name_ids, t._hb_ot_metrics_get_position_with_fallback = M.hb_ot_metrics_get_position_with_fallback, t._hb_ot_layout_lookup_get_optical_bound = M.hb_ot_layout_lookup_get_optical_bound, t._hb_ot_metrics_get_position = M.hb_ot_metrics_get_position, t._hb_ot_metrics_get_variation = M.hb_ot_metrics_get_variation, t._hb_ot_metrics_get_x_variation = M.hb_ot_metrics_get_x_variation, t._hb_ot_metrics_get_y_variation = M.hb_ot_metrics_get_y_variation, t._hb_ot_name_list_names = M.hb_ot_name_list_names, t._hb_ot_name_get_utf16 = M.hb_ot_name_get_utf16, t._hb_set_create = M.hb_set_create, t._hb_set_destroy = M.hb_set_destroy, t._hb_ot_tag_to_script = M.hb_ot_tag_to_script, t._hb_ot_tag_to_language = M.hb_ot_tag_to_language, t._hb_ot_var_get_axis_infos = M.hb_ot_var_get_axis_infos, t._hb_paint_funcs_set_push_transform_func = M.hb_paint_funcs_set_push_transform_func, t._hb_paint_funcs_set_pop_transform_func = M.hb_paint_funcs_set_pop_transform_func, t._hb_paint_funcs_set_color_glyph_func = M.hb_paint_funcs_set_color_glyph_func, t._hb_paint_funcs_set_push_clip_glyph_func = M.hb_paint_funcs_set_push_clip_glyph_func, t._hb_paint_funcs_set_push_clip_rectangle_func = M.hb_paint_funcs_set_push_clip_rectangle_func, t._hb_paint_funcs_set_pop_clip_func = M.hb_paint_funcs_set_pop_clip_func, t._hb_paint_funcs_set_color_func = M.hb_paint_funcs_set_color_func, t._hb_paint_funcs_set_image_func = M.hb_paint_funcs_set_image_func, t._hb_paint_funcs_set_linear_gradient_func = M.hb_paint_funcs_set_linear_gradient_func, t._hb_paint_funcs_set_radial_gradient_func = M.hb_paint_funcs_set_radial_gradient_func, t._hb_paint_funcs_set_sweep_gradient_func = M.hb_paint_funcs_set_sweep_gradient_func, t._hb_paint_funcs_set_push_group_func = M.hb_paint_funcs_set_push_group_func, t._hb_paint_funcs_set_pop_group_func = M.hb_paint_funcs_set_pop_group_func, t._hb_paint_funcs_set_custom_palette_color_func = M.hb_paint_funcs_set_custom_palette_color_func, t._hb_paint_funcs_create = M.hb_paint_funcs_create, t._hb_paint_funcs_destroy = M.hb_paint_funcs_destroy, t._hb_color_line_get_color_stops = M.hb_color_line_get_color_stops, t._hb_color_line_get_extend = M.hb_color_line_get_extend, t._hb_set_get_population = M.hb_set_get_population, t._hb_set_next_many = M.hb_set_next_many, t._hb_shape = M.hb_shape, An = M._emscripten_timeout, Gt = M._emscripten_stack_restore, At = M._emscripten_stack_alloc, Be = M.emscripten_stack_get_current;
  }
  var dn = { _abort_js: Le, _emscripten_runtime_keepalive_clear: St, _setitimer_js: Bn, emscripten_resize_heap: wn, proc_exit: wt }, He = await ge();
  function et() {
    if (q > 0) {
      Y = et;
      return;
    }
    if (W(), q > 0) {
      Y = et;
      return;
    }
    function M() {
      t.calledRun = true, !x && (N(), k?.(t), t.onRuntimeInitialized?.(), V());
    }
    t.setStatus ? (t.setStatus("Running..."), setTimeout(() => {
      setTimeout(() => t.setStatus(""), 1), M();
    }, 1)) : M();
  }
  function Ht() {
    if (t.preInit) for (typeof t.preInit == "function" && (t.preInit = [t.preInit]); t.preInit.length > 0; ) t.preInit.shift()();
  }
  return Ht(), et(), z ? n = t : n = new Promise((M, he) => {
    k = M, G = he;
  }), n;
}
let $, Z, Wa;
const Xi = new TextDecoder("utf8"), qi = new TextEncoder(), Va = new FinalizationRegistry((u) => {
  u();
});
function jr(u, n) {
  const t = u.ptr;
  Va.register(u, () => n(t));
}
function Yi(u) {
  $ = u, Z = $.wasmExports, Wa = $.addFunction((n) => {
    Z.free(n);
  }, "vi");
}
function Te(u) {
  return (u.charCodeAt(0) & 255) << 24 | (u.charCodeAt(1) & 255) << 16 | (u.charCodeAt(2) & 255) << 8 | (u.charCodeAt(3) & 255) << 0;
}
function Tn(u) {
  return [String.fromCharCode(u >> 24 & 255), String.fromCharCode(u >> 16 & 255), String.fromCharCode(u >> 8 & 255), String.fromCharCode(u >> 0 & 255)].join("");
}
function or(u, n) {
  let t;
  return n == null ? t = $.HEAPU8.indexOf(0, u) : t = u + n, Xi.decode($.HEAPU8.subarray(u, t));
}
function Ji(u, n) {
  const t = u / 2 + n;
  return String.fromCharCode(...$.HEAPU16.subarray(u / 2, t));
}
function Er(u) {
  const n = Z.malloc(u.length + 1);
  for (let t = 0; t < u.length; ++t) {
    const e = u.charCodeAt(t);
    if (e > 127) throw new Error("Expected ASCII text");
    $.HEAPU8[n + t] = e;
  }
  return $.HEAPU8[n + u.length] = 0, { ptr: n, length: u.length, free: function() {
    Z.free(n);
  } };
}
function Zi(u) {
  const n = Z.malloc(u.length);
  return qi.encodeInto(u, $.HEAPU8.subarray(n, n + u.length)), { ptr: n, length: u.length, free: function() {
    Z.free(n);
  } };
}
function Qi(u) {
  const n = Z.malloc(u.length * 2), t = $.HEAPU16.subarray(n / 2, n / 2 + u.length);
  for (let e = 0; e < t.length; ++e) t[e] = u.charCodeAt(e);
  return { ptr: n, length: t.length, free: function() {
    Z.free(n);
  } };
}
function el(u) {
  return or(Z.hb_language_to_string(u));
}
function tl(u) {
  const n = Er(u), t = Z.hb_language_from_string(n.ptr, -1);
  return n.free(), t;
}
function nl(u) {
  const n = Z.hb_set_get_population(u), t = Z.malloc(n << 2), e = t >> 2;
  return Z.hb_set_next_many(u, -1, t, n), $.HEAPU32.subarray(e, e + n);
}
const Sr = [void 0], Ka = [];
function qt(u) {
  if (u === void 0) return 0;
  const n = Ka.pop() ?? Sr.length;
  return Sr[n] = u, n;
}
function Nt(u) {
  return Sr[u];
}
function qn(u) {
  u !== 0 && (Sr[u] = void 0, Ka.push(u));
}
function rl(u) {
  return { red: u >> 8 & 255, green: u >> 16 & 255, blue: u >> 24 & 255, alpha: u & 255 };
}
function Zo(u) {
  return (u.red << 8 | u.green << 16 | u.blue << 24 | u.alpha) >>> 0;
}
var ol = class {
  constructor(n) {
    const t = n instanceof Uint8Array ? n : new Uint8Array(n), e = Z.malloc(t.byteLength);
    $.HEAPU8.set(t, e), this.ptr = Z.hb_blob_create(e, t.byteLength, 2, e, Wa), jr(this, Z.hb_blob_destroy);
  }
};
const Hn = 65535;
var Xa = class {
  constructor(u, n = 0) {
    typeof u == "number" ? this.ptr = Z.hb_face_reference(u) : this.ptr = Z.hb_face_create(u.ptr, n), this.upem = Z.hb_face_get_upem(this.ptr), jr(this, Z.hb_face_destroy);
  }
  referenceTable(u) {
    const n = Z.hb_face_reference_table(this.ptr, Te(u)), t = Z.hb_blob_get_length(n);
    if (!t) return;
    const e = Z.hb_blob_get_data(n, 0);
    return $.HEAPU8.subarray(e, e + t);
  }
  getAxisInfos() {
    const u = $.stackSave(), n = $.stackAlloc(2048), t = $.stackAlloc(4);
    $.HEAPU32[t / 4] = 64, Z.hb_ot_var_get_axis_infos(this.ptr, 0, t, n);
    const e = {};
    return Array.from({ length: $.HEAPU32[t / 4] }).forEach((r, o) => {
      const a = { axisIndex: $.HEAPU32[n / 4 + o * 8], tag: Tn($.HEAPU32[n / 4 + o * 8 + 1]), nameId: $.HEAPU32[n / 4 + o * 8 + 2], flags: $.HEAPU32[n / 4 + o * 8 + 3], min: $.HEAPF32[n / 4 + o * 8 + 4], default: $.HEAPF32[n / 4 + o * 8 + 5], max: $.HEAPF32[n / 4 + o * 8 + 6] };
      e[a.tag] = a;
    }), $.stackRestore(u), e;
  }
  collectUnicodes() {
    const u = Z.hb_set_create();
    Z.hb_face_collect_unicodes(this.ptr, u);
    const n = nl(u);
    return Z.hb_set_destroy(u), n;
  }
  getTableScriptTags(u) {
    const n = $.stackSave(), t = Te(u);
    let e = 0, r = 128;
    const o = $.stackAlloc(4), a = $.stackAlloc(512), s = [];
    for (; r == 128; ) {
      $.HEAPU32[o / 4] = r, Z.hb_ot_layout_table_get_script_tags(this.ptr, t, e, o, a), r = $.HEAPU32[o / 4];
      const i = $.HEAPU32.subarray(a / 4, a / 4 + r);
      s.push(...Array.from(i).map(Tn)), e += r;
    }
    return $.stackRestore(n), s;
  }
  getTableFeatureTags(u) {
    const n = $.stackSave(), t = Te(u);
    let e = 0, r = 128;
    const o = $.stackAlloc(4), a = $.stackAlloc(512), s = [];
    for (; r == 128; ) {
      $.HEAPU32[o / 4] = r, Z.hb_ot_layout_table_get_feature_tags(this.ptr, t, e, o, a), r = $.HEAPU32[o / 4];
      const i = $.HEAPU32.subarray(a / 4, a / 4 + r);
      s.push(...Array.from(i).map(Tn)), e += r;
    }
    return $.stackRestore(n), s;
  }
  getScriptLanguageTags(u, n) {
    const t = $.stackSave(), e = Te(u);
    let r = 0, o = 128;
    const a = $.stackAlloc(4), s = $.stackAlloc(512), i = [];
    for (; o == 128; ) {
      $.HEAPU32[a / 4] = o, Z.hb_ot_layout_script_get_language_tags(this.ptr, e, n, r, a, s), o = $.HEAPU32[a / 4];
      const l = $.HEAPU32.subarray(s / 4, s / 4 + o);
      i.push(...Array.from(l).map(Tn)), r += o;
    }
    return $.stackRestore(t), i;
  }
  getLanguageFeatureTags(u, n, t) {
    const e = $.stackSave(), r = Te(u);
    let o = 0, a = 128;
    const s = $.stackAlloc(4), i = $.stackAlloc(512), l = [];
    for (; a == 128; ) {
      $.HEAPU32[s / 4] = a, Z.hb_ot_layout_language_get_feature_tags(this.ptr, r, n, t, o, s, i), a = $.HEAPU32[s / 4];
      const h = $.HEAPU32.subarray(i / 4, i / 4 + a);
      l.push(...Array.from(h).map(Tn)), o += a;
    }
    return $.stackRestore(e), l;
  }
  getFeatureLookups(u, n) {
    const t = $.stackSave(), e = Te(u);
    let r = 0, o = 128;
    const a = $.stackAlloc(4), s = $.stackAlloc(512), i = [];
    for (; o == 128; ) {
      $.HEAPU32[a / 4] = o, Z.hb_ot_layout_feature_get_lookups(this.ptr, e, n, r, a, s), o = $.HEAPU32[a / 4];
      const l = $.HEAPU32.subarray(s / 4, s / 4 + o);
      i.push(...Array.from(l)), r += o;
    }
    return $.stackRestore(t), i;
  }
  getGlyphClass(u) {
    return Z.hb_ot_layout_get_glyph_class(this.ptr, u);
  }
  listNames() {
    const u = $.stackSave(), n = $.stackAlloc(4), t = Z.hb_ot_name_list_names(this.ptr, n), e = $.HEAPU32[n / 4], r = [];
    for (let o = 0; o < e; o++) r.push({ nameId: $.HEAPU32[t / 4 + o * 3], language: el($.HEAPU32[t / 4 + o * 3 + 2]) });
    return $.stackRestore(u), r;
  }
  getName(u, n) {
    const t = $.stackSave(), e = tl(n), r = Z.hb_ot_name_get_utf16(this.ptr, u, e, 0, 0) + 1, o = $.stackAlloc(4), a = Z.malloc(r * 2);
    $.HEAPU32[o / 4] = r, Z.hb_ot_name_get_utf16(this.ptr, u, e, o, a);
    const s = Ji(a, r - 1);
    return Z.free(a), $.stackRestore(t), s;
  }
  getFeatureNameIds(u, n) {
    const t = $.stackSave(), e = Te(u), r = $.stackAlloc(4), o = $.stackAlloc(4), a = $.stackAlloc(4), s = $.stackAlloc(4), i = $.stackAlloc(4), l = Z.hb_ot_layout_feature_get_name_ids(this.ptr, e, n, r, o, a, s, i);
    let h;
    if (l) {
      const m = $.HEAPU32[r / 4], _ = $.HEAPU32[o / 4], p = $.HEAPU32[a / 4], P = $.HEAPU32[s / 4], D = $.HEAPU32[i / 4];
      h = { paramUiLabelNameIds: Array.from({ length: P }, (x, A) => D + A) }, m != Hn && (h.uiLabelNameId = m), _ != Hn && (h.uiTooltipTextNameId = _), p != Hn && (h.sampleTextNameId = p);
    }
    return $.stackRestore(t), h;
  }
  hasColorPalettes() {
    return !!Z.hb_ot_color_has_palettes(this.ptr);
  }
  getColorPalettes() {
    const u = Z.hb_ot_color_palette_get_count(this.ptr), n = [], t = $.stackSave(), e = $.stackAlloc(4), r = $.stackAlloc(512);
    for (let o = 0; o < u; o++) {
      const a = [];
      let s = 0, i = 128;
      for (; i === 128; ) {
        $.HEAPU32[e / 4] = i, Z.hb_ot_color_palette_get_colors(this.ptr, o, s, e, r), i = $.HEAPU32[e / 4];
        for (let m = 0; m < i; m++) {
          const _ = rl($.HEAPU32[r / 4 + m]), p = Z.hb_ot_color_palette_color_get_name_id(this.ptr, s + m);
          p != Hn && (_.nameId = p), a.push(_);
        }
        s += i;
      }
      const l = { colors: a, flags: Z.hb_ot_color_palette_get_flags(this.ptr, o) }, h = Z.hb_ot_color_palette_get_name_id(this.ptr, o);
      h != Hn && (l.nameId = h), n.push(l);
    }
    return $.stackRestore(t), n;
  }
  hasColorLayers() {
    return !!Z.hb_ot_color_has_layers(this.ptr);
  }
  getGlyphColorLayers(u) {
    const n = [], t = $.stackSave(), e = $.stackAlloc(4), r = $.stackAlloc(1024);
    let o = 0, a = 128;
    for (; a === 128; ) {
      $.HEAPU32[e / 4] = a, Z.hb_ot_color_glyph_get_layers(this.ptr, u, o, e, r), a = $.HEAPU32[e / 4];
      for (let s = 0; s < a; s++) {
        const i = r / 4 + s * 2, l = { glyph: $.HEAPU32[i] }, h = $.HEAPU32[i + 1];
        h != 65535 && (l.colorIndex = h), n.push(l);
      }
      o += a;
    }
    return $.stackRestore(t), n;
  }
  hasColorPaint() {
    return !!Z.hb_ot_color_has_paint(this.ptr);
  }
  glyphHasColorPaint(u) {
    return !!Z.hb_ot_color_glyph_has_paint(this.ptr, u);
  }
  hasColorPng() {
    return !!Z.hb_ot_color_has_png(this.ptr);
  }
}, qa = class {
  constructor() {
    this.funcPtrs = [], this.userDataPtrs = [], this.ptr = Z.hb_draw_funcs_create();
    const u = this.ptr, n = this.funcPtrs, t = this.userDataPtrs;
    Va.register(this, () => {
      Z.hb_draw_funcs_destroy(u);
      for (const e of n) $.removeFunction(e);
      for (const e of t) qn(e);
    });
  }
  setMoveToFunc(u, n) {
    const t = qt(n);
    this.userDataPtrs.push(t);
    const e = $.addFunction((r, o, a, s, i, l) => {
      u(s, i, Nt(o), Nt(l));
    }, "viiiffi");
    this.funcPtrs.push(e), Z.hb_draw_funcs_set_move_to_func(this.ptr, e, t, 0);
  }
  setLineToFunc(u, n) {
    const t = qt(n);
    this.userDataPtrs.push(t);
    const e = $.addFunction((r, o, a, s, i, l) => {
      u(s, i, Nt(o), Nt(l));
    }, "viiiffi");
    this.funcPtrs.push(e), Z.hb_draw_funcs_set_line_to_func(this.ptr, e, t, 0);
  }
  setQuadraticToFunc(u, n) {
    const t = qt(n);
    this.userDataPtrs.push(t);
    const e = $.addFunction((r, o, a, s, i, l, h, m) => {
      u(s, i, l, h, Nt(o), Nt(m));
    }, "viiiffffi");
    this.funcPtrs.push(e), Z.hb_draw_funcs_set_quadratic_to_func(this.ptr, e, t, 0);
  }
  setCubicToFunc(u, n) {
    const t = qt(n);
    this.userDataPtrs.push(t);
    const e = $.addFunction((r, o, a, s, i, l, h, m, _, p) => {
      u(s, i, l, h, m, _, Nt(o), Nt(p));
    }, "viiiffffffi");
    this.funcPtrs.push(e), Z.hb_draw_funcs_set_cubic_to_func(this.ptr, e, t, 0);
  }
  setClosePathFunc(u, n) {
    const t = qt(n);
    this.userDataPtrs.push(t);
    const e = $.addFunction((r, o, a, s) => {
      u(Nt(o), Nt(s));
    }, "viiii");
    this.funcPtrs.push(e), Z.hb_draw_funcs_set_close_path_func(this.ptr, e, t, 0);
  }
};
Te("hasc"), Te("hdsc"), Te("hlgp"), Te("hcla"), Te("hcld"), Te("vasc"), Te("vdsc"), Te("vlgp"), Te("hcrs"), Te("hcrn"), Te("hcof"), Te("vcrs"), Te("vcrn"), Te("vcof"), Te("xhgt"), Te("cpht"), Te("sbxs"), Te("sbys"), Te("sbxo"), Te("sbyo"), Te("spxs"), Te("spys"), Te("spxo"), Te("spyo"), Te("strs"), Te("stro"), Te("unds"), Te("undo");
let tn;
function al() {
  return tn || (tn = new qa(), tn.setMoveToFunc((u, n, t) => {
    t.push(`M${u},${n}`);
  }), tn.setLineToFunc((u, n, t) => {
    t.push(`L${u},${n}`);
  }), tn.setCubicToFunc((u, n, t, e, r, o, a) => {
    a.push(`C${u},${n} ${t},${e} ${r},${o}`);
  }), tn.setQuadraticToFunc((u, n, t, e, r) => {
    r.push(`Q${u},${n} ${t},${e}`);
  }), tn.setClosePathFunc((u) => {
    u.push("Z");
  })), tn;
}
let nn;
function sl() {
  return nn || (nn = new qa(), nn.setMoveToFunc((u, n, t) => {
    t.push({ type: "M", values: [u, n] });
  }), nn.setLineToFunc((u, n, t) => {
    t.push({ type: "L", values: [u, n] });
  }), nn.setCubicToFunc((u, n, t, e, r, o, a) => {
    a.push({ type: "C", values: [u, n, t, e, r, o] });
  }), nn.setQuadraticToFunc((u, n, t, e, r) => {
    r.push({ type: "Q", values: [u, n, t, e] });
  }), nn.setClosePathFunc((u) => {
    u.push({ type: "Z", values: [] });
  })), nn;
}
var Ya = class Ja {
  constructor(n) {
    typeof n == "number" ? this.ptr = Z.hb_font_reference(n) : (this.ptr = Z.hb_font_create(n.ptr), this._face = n), jr(this, Z.hb_font_destroy);
  }
  get face() {
    return this._face || (this._face = new Xa(Z.hb_font_get_face(this.ptr))), this._face;
  }
  subFont() {
    return new Ja(Z.hb_font_create_sub_font(this.ptr));
  }
  hExtents() {
    const n = $.stackSave(), t = $.stackAlloc(48);
    Z.hb_font_get_h_extents(this.ptr, t);
    const e = { ascender: $.HEAP32[t / 4], descender: $.HEAP32[t / 4 + 1], lineGap: $.HEAP32[t / 4 + 2] };
    return $.stackRestore(n), e;
  }
  vExtents() {
    const n = $.stackSave(), t = $.stackAlloc(48);
    Z.hb_font_get_v_extents(this.ptr, t);
    const e = { ascender: $.HEAP32[t / 4], descender: $.HEAP32[t / 4 + 1], lineGap: $.HEAP32[t / 4 + 2] };
    return $.stackRestore(n), e;
  }
  glyphName(n) {
    const t = $.stackSave(), e = 256, r = $.stackAlloc(e);
    Z.hb_font_glyph_to_string(this.ptr, n, r, e);
    const o = or(r);
    return $.stackRestore(t), o;
  }
  drawGlyph(n, t, e) {
    const r = qt(e);
    try {
      Z.hb_font_draw_glyph(this.ptr, n, t.ptr, r);
    } finally {
      qn(r);
    }
  }
  drawGlyphOrFail(n, t, e) {
    const r = qt(e);
    try {
      return !!Z.hb_font_draw_glyph_or_fail(this.ptr, n, t.ptr, r);
    } finally {
      qn(r);
    }
  }
  paintGlyph(n, t, e, r = 0, o = { red: 0, green: 0, blue: 0, alpha: 255 }) {
    const a = qt(e);
    try {
      Z.hb_font_paint_glyph(this.ptr, n, t.ptr, a, r, Zo(o));
    } finally {
      qn(a);
    }
  }
  paintGlyphOrFail(n, t, e, r = 0, o = { red: 0, green: 0, blue: 0, alpha: 255 }) {
    const a = qt(e);
    try {
      return !!Z.hb_font_paint_glyph_or_fail(this.ptr, n, t.ptr, a, r, Zo(o));
    } finally {
      qn(a);
    }
  }
  getGlyphColorPng(n) {
    const t = Z.hb_ot_color_glyph_reference_png(this.ptr, n), e = Z.hb_blob_get_length(t);
    let r;
    if (e) {
      const o = Z.hb_blob_get_data(t, 0);
      r = $.HEAPU8.slice(o, o + e);
    }
    return Z.hb_blob_destroy(t), r;
  }
  glyphToPath(n) {
    const t = [];
    return this.drawGlyph(n, al(), t), t.join("");
  }
  glyphHAdvance(n) {
    return Z.hb_font_get_glyph_h_advance(this.ptr, n);
  }
  glyphVAdvance(n) {
    return Z.hb_font_get_glyph_v_advance(this.ptr, n);
  }
  glyphHOrigin(n) {
    const t = $.stackSave(), e = $.stackAlloc(4), r = $.stackAlloc(4);
    let o;
    return Z.hb_font_get_glyph_h_origin(this.ptr, n, e, r) && (o = [$.HEAP32[e / 4], $.HEAP32[r / 4]]), $.stackRestore(t), o;
  }
  glyphVOrigin(n) {
    const t = $.stackSave(), e = $.stackAlloc(4), r = $.stackAlloc(4);
    let o;
    return Z.hb_font_get_glyph_v_origin(this.ptr, n, e, r) && (o = [$.HEAP32[e / 4], $.HEAP32[r / 4]]), $.stackRestore(t), o;
  }
  glyphExtents(n) {
    const t = $.stackSave(), e = $.stackAlloc(16);
    let r;
    return Z.hb_font_get_glyph_extents(this.ptr, n, e) && (r = { xBearing: $.HEAP32[e / 4], yBearing: $.HEAP32[e / 4 + 1], width: $.HEAP32[e / 4 + 2], height: $.HEAP32[e / 4 + 3] }), $.stackRestore(t), r;
  }
  glyph(n, t = 0) {
    const e = $.stackSave(), r = $.stackAlloc(4);
    let o;
    return Z.hb_font_get_glyph(this.ptr, n, t, r) && (o = $.HEAPU32[r / 4]), $.stackRestore(e), o;
  }
  nominalGlyph(n) {
    const t = $.stackSave(), e = $.stackAlloc(4);
    let r;
    return Z.hb_font_get_nominal_glyph(this.ptr, n, e) && (r = $.HEAPU32[e / 4]), $.stackRestore(t), r;
  }
  variationGlyph(n, t) {
    const e = $.stackSave(), r = $.stackAlloc(4);
    let o;
    return Z.hb_font_get_variation_glyph(this.ptr, n, t, r) && (o = $.HEAPU32[r / 4]), $.stackRestore(e), o;
  }
  glyphFromName(n) {
    const t = $.stackSave(), e = $.stackAlloc(4), r = Zi(n);
    let o;
    return Z.hb_font_get_glyph_from_name(this.ptr, r.ptr, r.length, e) && (o = $.HEAPU32[e / 4]), r.free(), $.stackRestore(t), o;
  }
  glyphToJson(n) {
    const t = [];
    return this.drawGlyph(n, sl(), t), t;
  }
  setScale(n, t) {
    Z.hb_font_set_scale(this.ptr, n, t);
  }
  setVariations(n) {
    const t = $.stackSave(), e = $.stackAlloc(8 * n.length);
    n.forEach((r, o) => {
      r.writeTo(e + o * 8);
    }), Z.hb_font_set_variations(this.ptr, e, n.length), $.stackRestore(t);
  }
  setFuncs(n) {
    Z.hb_font_set_funcs(this.ptr, n.ptr);
  }
  getLookupOpticalBound(n, t, e) {
    return Z.hb_ot_layout_lookup_get_optical_bound(this.ptr, n, t, e);
  }
  getLigatureCarets(n, t) {
    const e = $.stackSave();
    let r = 0, o = 128;
    const a = $.stackAlloc(4), s = $.stackAlloc(512), i = [];
    for (; o == 128; ) {
      $.HEAPU32[a / 4] = o, Z.hb_ot_layout_get_ligature_carets(this.ptr, n, t, r, a, s), o = $.HEAPU32[a / 4];
      const l = $.HEAP32.subarray(s / 4, s / 4 + o);
      i.push(...Array.from(l)), r += o;
    }
    return $.stackRestore(e), i;
  }
  getMetricPosition(n) {
    const t = $.stackSave(), e = $.stackAlloc(4);
    let r;
    return Z.hb_ot_metrics_get_position(this.ptr, n, e) && (r = $.HEAP32[e / 4]), $.stackRestore(t), r;
  }
  getMetricPositionWithFallback(n) {
    const t = $.stackSave(), e = $.stackAlloc(4);
    Z.hb_ot_metrics_get_position_with_fallback(this.ptr, n, e);
    const r = $.HEAP32[e / 4];
    return $.stackRestore(t), r;
  }
  getMetricVariation(n) {
    return Z.hb_ot_metrics_get_variation(this.ptr, n);
  }
  getMetricXVariation(n) {
    return Z.hb_ot_metrics_get_x_variation(this.ptr, n);
  }
  getMetricYVariation(n) {
    return Z.hb_ot_metrics_get_y_variation(this.ptr, n);
  }
};
const il = { TEXT: Te("TEXT"), JSON: Te("JSON") };
var ll = class Za {
  constructor(n) {
    n != null ? this.ptr = Z.hb_buffer_reference(n) : this.ptr = Z.hb_buffer_create(), jr(this, Z.hb_buffer_destroy);
  }
  add(n, t) {
    Z.hb_buffer_add(this.ptr, n, t);
  }
  addText(n, t = 0, e) {
    const r = Qi(n);
    Z.hb_buffer_add_utf16(this.ptr, r.ptr, r.length, t, e ?? r.length), r.free();
  }
  addCodePoints(n, t = 0, e) {
    const r = Z.malloc(n.length * 4);
    $.HEAPU32.subarray(r / 4, r / 4 + n.length).set(n), Z.hb_buffer_add_codepoints(this.ptr, r, n.length, t, e ?? n.length), Z.free(r);
  }
  guessSegmentProperties() {
    Z.hb_buffer_guess_segment_properties(this.ptr);
  }
  setDirection(n) {
    Z.hb_buffer_set_direction(this.ptr, n);
  }
  setFlags(n) {
    Z.hb_buffer_set_flags(this.ptr, n);
  }
  setLanguage(n) {
    const t = Er(n);
    Z.hb_buffer_set_language(this.ptr, Z.hb_language_from_string(t.ptr, -1)), t.free();
  }
  setScript(n) {
    const t = Er(n);
    Z.hb_buffer_set_script(this.ptr, Z.hb_script_from_string(t.ptr, -1)), t.free();
  }
  setClusterLevel(n) {
    Z.hb_buffer_set_cluster_level(this.ptr, n);
  }
  reset() {
    Z.hb_buffer_reset(this.ptr);
  }
  clearContents() {
    Z.hb_buffer_clear_contents(this.ptr);
  }
  setMessageFunc(n) {
    const t = (r, o, a, s) => {
      const i = or(a);
      return n(new Za(r), new Ya(o), i) ? 1 : 0;
    }, e = $.addFunction(t, "iiiii");
    Z.hb_buffer_set_message_func(this.ptr, e, 0, 0);
  }
  getLength() {
    return Z.hb_buffer_get_length(this.ptr);
  }
  getGlyphInfos() {
    const n = Z.hb_buffer_get_glyph_infos(this.ptr, 0), t = $.HEAPU32.subarray(n / 4, n / 4 + this.getLength() * 5), e = [];
    for (let r = 0; r < t.length; r += 5) e.push({ codepoint: t[r], cluster: t[r + 2], flags: Z.hb_glyph_info_get_glyph_flags(n + r * 4) });
    return e;
  }
  getGlyphPositions() {
    const n = Z.hb_buffer_get_glyph_positions(this.ptr, 0) / 4;
    if (n == 0) return [];
    const t = $.HEAP32.subarray(n, n + this.getLength() * 5), e = [];
    for (let r = 0; r < t.length; r += 5) e.push({ xAdvance: t[r], yAdvance: t[r + 1], xOffset: t[r + 2], yOffset: t[r + 3] });
    return e;
  }
  getGlyphInfosAndPositions() {
    const n = Z.hb_buffer_get_glyph_infos(this.ptr, 0), t = $.HEAPU32.subarray(n / 4, n / 4 + this.getLength() * 5), e = Z.hb_buffer_get_glyph_positions(this.ptr, 0) / 4, r = e ? $.HEAP32.subarray(e, e + this.getLength() * 5) : void 0, o = [];
    for (let a = 0; a < t.length; a += 5) {
      const s = { codepoint: t[a], cluster: t[a + 2], flags: Z.hb_glyph_info_get_glyph_flags(n + a * 4) };
      for (const [i, l] of [["mask", 1], ["var1", 3], ["var2", 4]]) Object.defineProperty(s, i, { value: t[a + l], enumerable: false });
      r && (s.xAdvance = r[a], s.yAdvance = r[a + 1], s.xOffset = r[a + 2], s.yOffset = r[a + 3], Object.defineProperty(s, "var", { value: r[a + 4], enumerable: false })), o.push(s);
    }
    return o;
  }
  updateGlyphPositions(n) {
    const t = Z.hb_buffer_get_glyph_positions(this.ptr, 0) / 4;
    if (t == 0) return;
    const e = Math.min(n.length, this.getLength()), r = $.HEAP32.subarray(t, t + e * 5);
    for (let o = 0; o < e; o++) r[o * 5] = n[o].xAdvance, r[o * 5 + 1] = n[o].yAdvance, r[o * 5 + 2] = n[o].xOffset, r[o * 5 + 3] = n[o].yOffset;
  }
  serialize(n = {}) {
    let { font: t, start: e = 0, end: r, format: o = il.TEXT, flags: a = 0 } = n;
    const s = $.stackSave(), i = r ?? this.getLength(), l = 32 * 1024, h = Z.malloc(l), m = $.stackAlloc(4);
    let _ = "";
    for (; e < i; ) {
      e += Z.hb_buffer_serialize(this.ptr, e, i, h, l, m, t ? t.ptr : 0, o, a);
      const p = $.HEAPU32[m / 4];
      if (p == 0) break;
      _ += or(h, p);
    }
    return Z.free(h), $.stackRestore(s), _;
  }
  getContentType() {
    return Z.hb_buffer_get_content_type(this.ptr);
  }
}, cl = class Qa {
  constructor(n, t = 0) {
    this.tag = n, this.value = t;
  }
  static fromString(n) {
    const t = $.stackSave(), e = $.stackAlloc(8), r = Er(n);
    let o;
    return Z.hb_variation_from_string(r.ptr, -1, e) && (o = new Qa(Tn($.HEAPU32[e / 4]), $.HEAPF32[e / 4 + 1])), r.free(), $.stackRestore(t), o;
  }
  toString() {
    const n = $.stackSave(), t = $.stackAlloc(8);
    this.writeTo(t);
    const e = 128, r = $.stackAlloc(e);
    Z.hb_variation_to_string(t, r, e);
    const o = or(r);
    return $.stackRestore(n), o;
  }
  writeTo(n) {
    $.HEAPU32[n / 4] = Te(this.tag), $.HEAPF32[n / 4 + 1] = this.value;
  }
};
function ul(u, n, t) {
  const r = $.stackSave();
  Z.hb_shape(u.ptr, n.ptr, 0, 0), $.stackRestore(r);
}
async function hl(u) {
  Yi(await Ki(u));
}
const Kr = /* @__PURE__ */ new Map();
function Cr(u) {
  let n = Kr.get(u);
  return n || (n = dl(u), Kr.set(u, n), n.catch(() => Kr.delete(u))), n.then((t) => t.slice(0));
}
async function dl(u) {
  const n = [...document.querySelectorAll('script[type="application/x-margin-asset"]')].find((e) => e.dataset.name === u);
  if (n) {
    const e = atob((n.textContent || "").trim()), r = new Uint8Array(e.length);
    for (let a = 0; a < e.length; a++) r[a] = e.charCodeAt(a);
    const o = new Blob([r]).stream().pipeThrough(new DecompressionStream("gzip"));
    return new Response(o).arrayBuffer();
  }
  const t = await fetch(u);
  if (!t.ok) throw new Error(`${u} could not be loaded (${t.status})`);
  return t.arrayBuffer();
}
const sn = [{ key: "helv", label: "Helvetica", group: "Standard", css: "Helvetica, Arial, sans-serif", std: ["Helvetica", "Helvetica-Bold", "Helvetica-Oblique", "Helvetica-BoldOblique"] }, { key: "times", label: "Times", group: "Standard", css: '"Times New Roman", Times, serif', std: ["Times-Roman", "Times-Bold", "Times-Italic", "Times-BoldItalic"] }, { key: "courier", label: "Courier", group: "Standard", css: '"Courier New", Courier, monospace', std: ["Courier", "Courier-Bold", "Courier-Oblique", "Courier-BoldOblique"] }, { key: "sarabun", label: "Sarabun", group: "Thai + Latin", css: "MarginSarabun", file: "Sarabun-Regular.ttf", b: "Sarabun-Bold.ttf", i: "Sarabun-Italic.ttf", bi: "Sarabun-BoldItalic.ttf" }, { key: "notosansthai", label: "Noto Sans Thai", group: "Thai + Latin", css: "MarginNotoSansThai", file: "NotoSansThai.ttf", vw: true }, { key: "notoserifthai", label: "Noto Serif Thai", group: "Thai + Latin", css: "MarginNotoSerifThai", file: "NotoSerifThai.ttf", vw: true }, { key: "kanit", label: "Kanit", group: "Thai + Latin", css: "MarginKanit", file: "Kanit-Regular.ttf", b: "Kanit-Bold.ttf", i: "Kanit-Italic.ttf", bi: "Kanit-BoldItalic.ttf" }, { key: "prompt", label: "Prompt", group: "Thai + Latin", css: "MarginPrompt", file: "Prompt-Regular.ttf", b: "Prompt-Bold.ttf", i: "Prompt-Italic.ttf", bi: "Prompt-BoldItalic.ttf" }, { key: "mitr", label: "Mitr", group: "Thai + Latin", css: "MarginMitr", file: "Mitr-Regular.ttf", b: "Mitr-Bold.ttf" }, { key: "baijamjuree", label: "Bai Jamjuree", group: "Thai + Latin", css: "MarginBaiJamjuree", file: "BaiJamjuree-Regular.ttf", b: "BaiJamjuree-Bold.ttf", i: "BaiJamjuree-Italic.ttf", bi: "BaiJamjuree-BoldItalic.ttf" }, { key: "chakrapetch", label: "Chakra Petch", group: "Thai + Latin", css: "MarginChakraPetch", file: "ChakraPetch-Regular.ttf", b: "ChakraPetch-Bold.ttf", i: "ChakraPetch-Italic.ttf", bi: "ChakraPetch-BoldItalic.ttf" }, { key: "plexthai", label: "IBM Plex Sans Thai", group: "Thai + Latin", css: "MarginPlexThai", file: "IBMPlexSansThai-Regular.ttf", b: "IBMPlexSansThai-Bold.ttf" }, { key: "roboto", label: "Roboto", group: "Latin", css: "MarginRoboto", file: "Roboto.ttf", i: "Roboto-Italic.ttf", vw: true }, { key: "opensans", label: "Open Sans", group: "Latin", css: "MarginOpenSans", file: "OpenSans.ttf", i: "OpenSans-Italic.ttf", vw: true }, { key: "lato", label: "Lato", group: "Latin", css: "MarginLato", file: "Lato-Regular.ttf", b: "Lato-Bold.ttf" }, { key: "montserrat", label: "Montserrat", group: "Latin", css: "MarginMontserrat", file: "Montserrat.ttf", i: "Montserrat-Italic.ttf", vw: true }, { key: "poppins", label: "Poppins", group: "Latin", css: "MarginPoppins", file: "Poppins-Regular.ttf", b: "Poppins-Bold.ttf", i: "Poppins-Italic.ttf", bi: "Poppins-BoldItalic.ttf" }, { key: "nunito", label: "Nunito", group: "Latin", css: "MarginNunito", file: "Nunito.ttf", i: "Nunito-Italic.ttf", vw: true }, { key: "playfair", label: "Playfair Display", group: "Latin", css: "MarginPlayfair", file: "PlayfairDisplay.ttf", i: "PlayfairDisplay-Italic.ttf", vw: true }, { key: "oswald", label: "Oswald", group: "Latin", css: "MarginOswald", file: "Oswald.ttf", vw: true }, { key: "robotomono", label: "Roboto Mono", group: "Latin", css: "MarginRobotoMono", file: "RobotoMono.ttf", i: "RobotoMono-Italic.ttf", vw: true }], ze = (u) => sn.find((n) => n.key === u) || sn[0], Dr = (u) => u.std ? u.css : `"${u.css}", sans-serif`, ml = /[฀-๿຀-໿က-႟ក-៿ऀ-෿]/, ar = (u) => ml.test(u), es = (u) => /[฀-๿]/.test(u), Br = (u) => [...u].every((n) => n.codePointAt(0) < 256 || "€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ".includes(n)), Mr = (u) => (u.bold ? "b" : "") + (u.italic ? "i" : "") + (u.underline ? "u" : "") + (u.strike ? "s" : ""), Gr = (u) => ({ bold: u.includes("b"), italic: u.includes("i"), underline: u.includes("u"), strike: u.includes("s") });
function on(u, n) {
  const t = !!n.bold, e = !!n.italic;
  if (u.std) return { def: u, std: u.std[(t ? 1 : 0) + (e ? 2 : 0)], fakeBold: false, fakeItalic: false, key: u.key + (t ? "b" : "") + (e ? "i" : "") };
  let r = u.file, o, a = false, s = false;
  return t && e ? u.bi ? r = u.bi : u.i && u.vw ? (r = u.i, o = 700) : u.b ? (r = u.b, s = true) : u.i ? (r = u.i, a = true) : u.vw ? (o = 700, s = true) : a = s = true : t ? u.b ? r = u.b : u.vw ? o = 700 : a = true : e && (u.i ? r = u.i : s = true), { def: u, file: r, wght: o, fakeBold: a, fakeItalic: s, key: r + (o ? "@" + o : "") };
}
const fl = Math.tan(12 * Math.PI / 180), Xr = /* @__PURE__ */ new Map();
let Ao = null;
function _l(u) {
  return Ao = hl({ wasmBinary: u }), Ao;
}
function $t(u) {
  return an(on(u, {}));
}
function an(u) {
  if (u.std) return Promise.resolve({ bytes: new Uint8Array(), upem: 1e3, ascent: 0.75 });
  let n = Xr.get(u.key);
  return n || (n = (async () => {
    const t = u.def, e = u.file, r = await Cr("fonts/" + e).catch(() => {
      throw new Error(`Font ${t.label} failed to load`);
    }), o = new Uint8Array(r), a = { weight: t.vw ? "100 900" : e === t.b || e === t.bi ? "700" : "400", style: e === t.i || e === t.bi ? "italic" : "normal" };
    try {
      const m = new FontFace(t.css, r.slice(0), a);
      await m.load(), document.fonts.add(m);
    } catch {
    }
    await Ao;
    const s = new Xa(new ol(r.slice(0))), i = new Ya(s);
    if (u.wght) {
      const m = cl.fromString("wght=" + u.wght);
      m && i.setVariations([m]);
    }
    const l = s.upem;
    let h = 0.8;
    try {
      const m = i.hExtents ? i.hExtents() : null;
      m?.ascender && (h = m.ascender / l);
    } catch {
    }
    return { bytes: o, hbFont: i, upem: l, ascent: h, file: e };
  })(), Xr.set(u.key, n), n.catch(() => Xr.delete(u.key))), n;
}
const Qo = /* @__PURE__ */ new WeakMap();
function pl(u, n, t) {
  let e = Qo.get(u);
  (!e || e.h !== u.h) && (e = { h: u.h, m: /* @__PURE__ */ new Map() }, Qo.set(u, e));
  const r = e.m, o = n.std || n.file;
  let a = r.get(o);
  if (!a) {
    if (a = n.std ? u.P.FPDFText_LoadStandardFont(u.h, n.std) : u.P.FPDFText_LoadFont(u.h, u.lib.bytes(t.bytes), t.bytes.length, 2, true), !a) throw new Error(`PDFium could not embed ${n.def.label}`);
    r.set(o, a);
  }
  return a;
}
function Zt(u, n) {
  const t = new ll();
  t.addText(n), t.guessSegmentProperties(), ul(u.hbFont, t);
  const e = t.getGlyphInfos(), r = t.getGlyphPositions(), o = [];
  let a = 0;
  for (let s = 0; s < e.length; s++) o.push({ gid: e[s].codepoint, x: a + r[s].xOffset, y: r[s].yOffset, adv: r[s].xAdvance }), a += r[s].xAdvance;
  return { glyphs: o, width: a / u.upem };
}
function Co(u, n, t, e) {
  if (u.std) {
    const r = document.createElement("canvas").getContext("2d");
    return r.font = `${u.std.includes("Oblique") || u.std.includes("Italic") ? "italic " : ""}${u.std.includes("Bold") ? "bold " : ""}${e * 10}px ${u.def.css}`, r.measureText(t).width / 10;
  }
  return Zt(n, t).width * e;
}
async function Tr(u, n, t) {
  let e = ze(t.fontKey), r = false;
  const o = t.lines.join("");
  e.std && !Br(o) && (e = ze("sarabun"), r = true);
  const a = on(e, t), s = await an(a), i = t.id || "b" + Math.random().toString(36).slice(2, 9), l = t.lineHeight ?? 1.5, h = l * t.size, m = t.size, [_, p, P, D, x, A] = t.matrix, w = u.lib, k = u.P, G = pl(u, a, s), E = t.color, B = E.slice(0, 3).map((q) => q.toString(16).padStart(2, "0")).join(""), z = t.lines.map((q) => q ? Co(a, s, q, m) : 0), O = Math.max(0, ...z), W = a.fakeItalic ? fl : 0, N = a.fakeBold ? m * 0.035 * Math.hypot(_, p) : 0, V = { ...t.extra || {}, id: i, font: e.key, size: String(m), color: B, lh: String(l), st: Mr(t), al: t.align || "left", bm: t.matrix.map((q) => +q.toFixed(4)).join(",") };
  return u.withPage(n, (q) => {
    t.lines.forEach((Y, ne) => {
      if (!Y) return;
      const J = t.align === "center" ? (O - z[ne]) / 2 : t.align === "right" ? O - z[ne] : 0, ee = x - P * h * ne + _ * J, ae = A - D * h * ne + p * J, de = !a.std && (ar(Y) || !!a.wght);
      if (de) {
        const ce = m / s.upem;
        for (const Ge of Zt(s, Y).glyphs) {
          const ge = Fl(w, s.hbFont, Ge.gid, ($e, Ce) => {
            let Ee = (Ge.x + $e) * ce;
            const Oe = (Ge.y + Ce) * ce;
            return Ee += W * Oe, [_ * Ee + P * Oe + ee, p * Ee + D * Oe + ae];
          });
          ge && (k.FPDFPageObj_SetFillColor(ge, E[0], E[1], E[2], E[3]), N && (k.FPDFPageObj_SetStrokeColor(ge, E[0], E[1], E[2], E[3]), k.FPDFPageObj_SetStrokeWidth(ge, N), k.FPDFPageObj_SetLineJoin(ge, 1)), k.FPDFPath_SetDrawMode(ge, 1, !!N), Qn(u, ge, "MarginGlyph", { id: i }), k.FPDFPage_InsertObject(q, ge));
        }
      }
      const oe = k.FPDFPageObj_CreateTextObj(u.h, G, m), fe = w.wstr(Y);
      k.FPDFText_SetText(oe, fe), w.free(fe), k.FPDFPageObj_SetFillColor(oe, E[0], E[1], E[2], E[3]), de ? k.FPDFTextObj_SetTextRenderMode(oe, 3) : N && (k.FPDFTextObj_SetTextRenderMode(oe, 2), k.FPDFPageObj_SetStrokeColor(oe, E[0], E[1], E[2], E[3]), k.FPDFPageObj_SetStrokeWidth(oe, N));
      const we = w.floats([_, p, P + W * _, D + W * p, ee, ae]);
      k.FPDFPageObj_SetMatrix(oe, we), w.free(we), Qn(u, oe, "MarginText", { ...V, ln: String((t.ln0 || 0) + ne) }), k.FPDFPage_InsertObject(q, oe);
      for (const [ce, Ge] of [[t.underline, -0.13], [t.strike, 0.27]]) {
        if (!ce) continue;
        const ge = m * 0.055, $e = Ge * m, Ce = 0, Ee = z[ne], Oe = (f, Ct) => [_ * f + P * Ct + ee, p * f + D * Ct + ae], [Ke, Xe] = Oe(Ce, $e - ge / 2), [dt, Rt] = Oe(Ee, $e - ge / 2), [It, Le] = Oe(Ee, $e + ge / 2), [Ut, St] = Oe(Ce, $e + ge / 2), Qe = k.FPDFPageObj_CreateNewPath(Ke, Xe);
        k.FPDFPath_LineTo(Qe, dt, Rt), k.FPDFPath_LineTo(Qe, It, Le), k.FPDFPath_LineTo(Qe, Ut, St), k.FPDFPath_Close(Qe), k.FPDFPageObj_SetFillColor(Qe, E[0], E[1], E[2], E[3]), k.FPDFPath_SetDrawMode(Qe, 1, false), Qn(u, Qe, "MarginGlyph", { id: i }), k.FPDFPage_InsertObject(q, Qe);
      }
    }), k.FPDFPage_GenerateContent(q);
  }), { fontKey: e.key, fellBack: r };
}
function Qn(u, n, t, e) {
  const r = u.P.FPDFPageObj_AddMark(n, t);
  for (const [o, a] of Object.entries(e)) u.P.FPDFPageObjMark_SetStringParam(u.h, n, r, o, a);
}
function lr(u, n, t, e) {
  const r = u.glyphToPath(n);
  if (!r) return false;
  const o = r.match(/[MLQCZ]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) || [];
  let a = 0, s = 0, i = 0;
  const l = () => +o[a++];
  for (; a < o.length; ) {
    const h = o[a++];
    if (h === "M") s = l(), i = l(), e.move(...t(s, i));
    else if (h === "L") s = l(), i = l(), e.line(...t(s, i));
    else if (h === "Q") {
      const m = l(), _ = l(), p = l(), P = l();
      e.curve(...t(s + 2 / 3 * (m - s), i + 2 / 3 * (_ - i)), ...t(p + 2 / 3 * (m - p), P + 2 / 3 * (_ - P)), ...t(p, P)), s = p, i = P;
    } else if (h === "C") {
      const m = [l(), l(), l(), l(), l(), l()];
      e.curve(...t(m[0], m[1]), ...t(m[2], m[3]), ...t(m[4], m[5])), s = m[4], i = m[5];
    } else h === "Z" && e.close();
  }
  return true;
}
function Fl(u, n, t, e) {
  const r = u.P;
  let o = 0;
  return lr(n, t, e, { move: (a, s) => {
    o ? r.FPDFPath_MoveTo(o, a, s) : o = r.FPDFPageObj_CreateNewPath(a, s);
  }, line: (a, s) => r.FPDFPath_LineTo(o, a, s), curve: (a, s, i, l, h, m) => r.FPDFPath_BezierTo(o, a, s, i, l, h, m), close: () => {
    o && r.FPDFPath_Close(o);
  } }), o;
}
function gt(u, n, t) {
  const e = u.P;
  u.withPage(n, (r) => {
    for (let o = e.FPDFPage_CountObjects(r) - 1; o >= 0; o--) {
      const a = e.FPDFPage_GetObject(r, o), s = rn(u.lib, a, "MarginGlyph") || rn(u.lib, a, "MarginText");
      s && s.id === t && (e.FPDFPage_RemoveObject(r, a), e.FPDFPageObj_Destroy(a));
    }
    e.FPDFPage_GenerateContent(r);
  });
}
function Fn(u, n, t) {
  const e = u.P;
  u.withPage(n, (r) => {
    const o = t.map((a) => e.FPDFPage_GetObject(r, a)).filter(Boolean);
    for (const a of o) e.FPDFPage_RemoveObject(r, a) && e.FPDFPageObj_Destroy(a);
    e.FPDFPage_GenerateContent(r);
  });
}
function ts(u, n, t, e) {
  const r = u.P, o = u.lib;
  return u.withPage(n, (a, s) => {
    const i = r.FPDFPage_GetObject(a, t), l = o.readW((p, P) => r.FPDFTextObj_GetText(i, s, p, P)), h = o.wstr(e);
    r.FPDFText_SetText(i, h), o.free(h);
    const m = r.FPDFText_LoadPage(a), _ = o.readW((p, P) => r.FPDFTextObj_GetText(i, m, p, P));
    if (r.FPDFText_ClosePage(m), _.replace(/\s+/g, " ").trim() !== e.replace(/\s+/g, " ").trim()) {
      const p = o.wstr(l);
      return r.FPDFText_SetText(i, p), o.free(p), false;
    }
    return r.FPDFPage_GenerateContent(a), true;
  }, { text: true });
}
async function ns(u, n, t, e, r = "sarabun") {
  const o = u.fieldLook(n, t), a = o.rect, s = a.r - a.l, i = a.t - a.b, l = o.borderWidth || 0, h = await $t(ze(r)), m = 2 + l, _ = o.multiline ? e.replace(/\r/g, "").split(`
`) : [e.replace(/[\r\n]+/g, " ")];
  let p = o.size || (o.multiline ? 11 : Math.max(6, Math.min(14, i * 0.62)));
  if (!o.multiline && !o.size) {
    const k = Zt(h, _[0]).width * p;
    k > s - m * 2 && (p = Math.max(5, p * (s - m * 2) / k));
  }
  const P = (k) => (Math.round(k * 1e3) / 1e3).toString(), D = ["q"];
  o.background && D.push(`${o.background.map((k) => P(k / 255)).join(" ")} rg ${P(a.l)} ${P(a.b)} ${P(s)} ${P(i)} re f`), o.border && l > 0 && D.push(`${o.border.map((k) => P(k / 255)).join(" ")} RG ${P(l)} w ${P(a.l + l / 2)} ${P(a.b + l / 2)} ${P(s - l)} ${P(i - l)} re S`), D.push(`${P(a.l + l)} ${P(a.b + l)} ${P(s - 2 * l)} ${P(i - 2 * l)} re W n 0 0 0 rg`);
  const x = p / h.upem, A = p * 1.2;
  let w = o.multiline ? a.t - m - h.ascent * p : a.b + (i - p) / 2 + p * 0.24;
  for (const k of _) {
    const { glyphs: G } = Zt(h, k);
    for (const E of G) lr(h.hbFont, E.gid, (z, O) => [a.l + m + (E.x + z) * x, w + (E.y + O) * x], { move: (z, O) => D.push(`${P(z)} ${P(O)} m`), line: (z, O) => D.push(`${P(z)} ${P(O)} l`), curve: (z, O, W, N, V, q) => D.push(`${P(z)} ${P(O)} ${P(W)} ${P(N)} ${P(V)} ${P(q)} c`), close: () => D.push("h") }) && D.push("f");
    w -= A;
  }
  if (D.push("Q"), !u.setNormalAppearance(n, t, D.join(`
`))) throw new Error("Could not draw the field");
}
function rs(u, n) {
  const t = u.toLowerCase().replace(/^[a-z]{6}\+/, "");
  if (es(n)) {
    for (const e of sn) if (e.group === "Thai + Latin" && t.replace(/[^a-z]/g, "").includes(e.label.toLowerCase().replace(/[^a-z]/g, ""))) return e.key;
    return "sarabun";
  }
  for (const e of sn) if (!e.std && t.replace(/[^a-z]/g, "").includes(e.label.toLowerCase().replace(/[^a-z]/g, ""))) return e.key;
  return /times|serif|georgia|garamond|roman/.test(t) ? "times" : /courier|mono|consol/.test(t) ? "courier" : "helv";
}
async function os(u, n, t) {
  let e = ze(u);
  e.std && !Br(n) && (e = ze("sarabun"));
  const r = on(e, {});
  return Co(r, await an(r), n, t);
}
function gl(u, n, t, e, r, o, a) {
  const s = u.P, i = u.lib, l = i.M;
  u.withPage(n, (h) => {
    const m = s.FPDFBitmap_Create(e, r, 1), _ = s.FPDFBitmap_GetBuffer(m), p = s.FPDFBitmap_GetStride(m);
    for (let x = 0; x < r; x++) for (let A = 0; A < e; A++) {
      const w = (x * e + A) * 4, k = _ + x * p + A * 4;
      l.HEAPU8[k] = t[w + 2], l.HEAPU8[k + 1] = t[w + 1], l.HEAPU8[k + 2] = t[w], l.HEAPU8[k + 3] = t[w + 3];
    }
    const P = s.FPDFPageObj_NewImageObj(u.h);
    s.FPDFImageObj_SetBitmap(0, 0, P, m), s.FPDFBitmap_Destroy(m);
    const D = i.floats(o);
    s.FPDFPageObj_SetMatrix(P, D), i.free(D), Qn(u, P, "MarginGlyph", { id: a }), s.FPDFPage_InsertObject(h, P), s.FPDFPage_GenerateContent(h);
  });
}
function cr(u, n) {
  let t = ze(u);
  return t.std && (t = ze({ helv: "roboto", times: "notoserifthai", courier: "robotomono" }[t.key] || "sarabun")), es(n) && t.group !== "Thai + Latin" && (t = ze("sarabun")), t;
}
const bl = typeof Intl < "u" && Intl.Segmenter ? new Intl.Segmenter("th", { granularity: "word" }) : null, Pl = typeof Intl < "u" && Intl.Segmenter ? new Intl.Segmenter("th", { granularity: "grapheme" }) : null, ea = (u, n) => n ? [...n.segment(u)].map((t) => t.segment) : u.split(/(?<=\s)/);
function as(u, n, t, e) {
  const r = (a) => Zt(u, a).width * t, o = [];
  for (const a of n.replace(/\r/g, "").split(`
`)) {
    let s = "";
    for (const i of ea(a, bl)) {
      if (!s || r(s + i) <= e) {
        if (s += i, r(s) <= e || /^\s+$/.test(i)) continue;
      } else if (o.push(s.trimEnd()), s = i.trimStart(), r(s) <= e) continue;
      const l = ea(s, Pl);
      s = "";
      for (const h of l) s && r(s + h) > e ? (o.push(s), s = h) : s += h;
    }
    o.push(s.trimEnd());
  }
  return o;
}
const er = 4;
async function ta(u) {
  const n = await $t(cr(u.style.fontKey, u.text)), t = u.style.border ? u.style.borderWidth : 0;
  return as(n, u.text || " ", u.style.size, u.box.r - u.box.l - 2 * (er + t)).length * u.style.size * 1.3 + 2 * (er + t);
}
async function ko(u, n, t, e) {
  const r = await $t(cr(e.style.fontKey, e.text)), { box: o, style: a } = e, s = a.border ? a.borderWidth : 0, i = (w) => (Math.round(w * 1e3) / 1e3).toString(), l = (w) => w.slice(0, 3).map((k) => i(k / 255)).join(" "), h = o.r - o.l, m = o.t - o.b, _ = ["q"];
  let p = { ...o };
  if (e.tip && a.border) {
    const w = vo(o, e.tip);
    if (Math.hypot(w.x - e.tip.x, w.y - e.tip.y) > 2) {
      const k = Math.max(1, s), G = Math.max(7, k * 4.5), E = 28 * Math.PI / 180, B = e.tip.x - w.x, z = e.tip.y - w.y, O = Math.hypot(B, z), W = B / O, N = z / O, V = (ee) => ({ x: e.tip.x - G * (W * Math.cos(E) - N * Math.sin(E) * ee), y: e.tip.y - G * (N * Math.cos(E) + W * Math.sin(E) * ee) }), q = V(1), Y = V(-1);
      _.push(`${l(a.border)} RG ${i(k)} w 1 J 1 j ${i(w.x)} ${i(w.y)} m ${i(e.tip.x)} ${i(e.tip.y)} l S ${i(q.x)} ${i(q.y)} m ${i(e.tip.x)} ${i(e.tip.y)} l ${i(Y.x)} ${i(Y.y)} l S`);
      const ne = [o.l, o.r, e.tip.x, q.x, Y.x], J = [o.b, o.t, e.tip.y, q.y, Y.y];
      p = { l: Math.min(...ne) - k, r: Math.max(...ne) + k, b: Math.min(...J) - k, t: Math.max(...J) + k };
    }
  }
  a.fill && _.push(`${l(a.fill)} rg ${i(o.l)} ${i(o.b)} ${i(h)} ${i(m)} re f`), a.border && s > 0 && _.push(`${l(a.border)} RG ${i(s)} w 0 J 0 j ${i(o.l + s / 2)} ${i(o.b + s / 2)} ${i(h - s)} ${i(m - s)} re S`), _.push(`${i(o.l + s)} ${i(o.b + s)} ${i(h - 2 * s)} ${i(m - 2 * s)} re W n ${l(a.color)} rg`);
  const P = a.size, D = P / r.upem, x = P * 1.3;
  let A = o.t - s - er - r.ascent * P - (x - P) / 2;
  for (const w of as(r, e.text, P, h - 2 * (er + s))) {
    const { glyphs: k } = Zt(r, w);
    for (const G of k) lr(r.hbFont, G.gid, (B, z) => [o.l + s + er + (G.x + B) * D, A + (G.y + z) * D], { move: (B, z) => _.push(`${i(B)} ${i(z)} m`), line: (B, z) => _.push(`${i(B)} ${i(z)} l`), curve: (B, z, O, W, N, V) => _.push(`${i(B)} ${i(z)} ${i(O)} ${i(W)} ${i(N)} ${i(V)} c`), close: () => _.push("h") }) && _.push("f");
    A -= x;
  }
  _.push("Q"), u.writeFreeText(n, t, e, p, _.join(`
`));
}
async function Dl(u, n) {
  const t = await an(on(ze("sarabun"), { bold: true })), e = u.sub ? await $t(ze("sarabun")) : null, r = 22, o = 8.5, a = 12, s = 7, i = 2.2, l = Zt(t, u.label), h = u.sub && e ? Zt(e, u.sub) : null, _ = Math.max(l.width * r, h ? h.width * o : 0) + a * 2, p = r * 1.05 + (h ? o * 1.5 : 0) + s * 2, P = { l: n.x - _ / 2, r: n.x + _ / 2, b: n.y - p / 2, t: n.y + p / 2 }, D = (E) => (Math.round(E * 1e3) / 1e3).toString(), x = u.color.slice(0, 3).map((E) => D(E / 255)).join(" "), A = ["q", `${x} RG ${x} rg`], w = (E, B, z, O, W) => {
    const N = 0.5523 * W;
    A.push(`${D(E + W)} ${D(B)} m ${D(E + z - W)} ${D(B)} l ${D(E + z - W + N)} ${D(B)} ${D(E + z)} ${D(B + W - N)} ${D(E + z)} ${D(B + W)} c ${D(E + z)} ${D(B + O - W)} l ${D(E + z)} ${D(B + O - W + N)} ${D(E + z - W + N)} ${D(B + O)} ${D(E + z - W)} ${D(B + O)} c ${D(E + W)} ${D(B + O)} l ${D(E + W - N)} ${D(B + O)} ${D(E)} ${D(B + O - W + N)} ${D(E)} ${D(B + O - W)} c ${D(E)} ${D(B + W)} l ${D(E)} ${D(B + W - N)} ${D(E + W - N)} ${D(B)} ${D(E + W)} ${D(B)} c h S`);
  };
  A.push(`${D(i)} w`), w(P.l + i / 2, P.b + i / 2, _ - i, p - i, 6), A.push(`${D(i * 0.45)} w`), w(P.l + i * 2.2, P.b + i * 2.2, _ - i * 4.4, p - i * 4.4, 4);
  const k = (E, B, z, O) => {
    const W = z / E.upem, N = n.x - B.width * z / 2;
    for (const V of B.glyphs) lr(E.hbFont, V.gid, (Y, ne) => [N + (V.x + Y) * W, O + (V.y + ne) * W], { move: (Y, ne) => A.push(`${D(Y)} ${D(ne)} m`), line: (Y, ne) => A.push(`${D(Y)} ${D(ne)} l`), curve: (Y, ne, J, ee, ae, de) => A.push(`${D(Y)} ${D(ne)} ${D(J)} ${D(ee)} ${D(ae)} ${D(de)} c`), close: () => A.push("h") }) && A.push("f");
  }, G = P.t - s;
  return k(t, l, r, G - r * 0.82), h && e && k(e, h, o, G - r * 1.05 - o * 1.05), A.push("Q"), { rect: P, content: A.join(`
`) };
}
async function yl(u, n, t, e, r) {
  const o = await $t(cr(t, n)), a = Zt(o, n), s = e / o.upem, i = -(a.width * e) / 2, l = -e * 0.35, h = u.P;
  let m = 0;
  for (const _ of a.glyphs) lr(o.hbFont, _.gid, (p, P) => r(i + (_.x + p) * s, l + (_.y + P) * s), { move: (p, P) => {
    m ? h.FPDFPath_MoveTo(m, p, P) : m = h.FPDFPageObj_CreateNewPath(p, P);
  }, line: (p, P) => h.FPDFPath_LineTo(m, p, P), curve: (p, P, D, x, A, w) => h.FPDFPath_BezierTo(m, p, P, D, x, A, w), close: () => {
    m && h.FPDFPath_Close(m);
  } });
  if (!m) throw new Error("Nothing to draw");
  return h.FPDFPath_SetDrawMode(m, 1, 0), m;
}
function na(u, n, t, e, r) {
  const o = u.P;
  u.withPage(n, (a) => {
    Qn(u, t, "MarginGlyph", { id: e }), r < 0 ? o.FPDFPage_InsertObject(a, t) : o.FPDFPage_InsertObjectAtIndex(a, t, r), o.FPDFPage_GenerateContent(a);
  });
}
function wl(u, n, t, e, r) {
  const o = u.P, a = u.lib.M, s = o.FPDFBitmap_Create(t, e, 1), i = o.FPDFBitmap_GetBuffer(s), l = o.FPDFBitmap_GetStride(s);
  for (let _ = 0; _ < e; _++) for (let p = 0; p < t; p++) {
    const P = (_ * t + p) * 4, D = i + _ * l + p * 4;
    a.HEAPU8[D] = n[P + 2], a.HEAPU8[D + 1] = n[P + 1], a.HEAPU8[D + 2] = n[P], a.HEAPU8[D + 3] = n[P + 3];
  }
  const h = o.FPDFPageObj_NewImageObj(u.h);
  o.FPDFImageObj_SetBitmap(0, 0, h, s), o.FPDFBitmap_Destroy(s);
  const m = u.lib.floats(r);
  return o.FPDFPageObj_SetMatrix(h, m), u.lib.free(m), h;
}
const _e = (u, n = document) => n.querySelector(u), ra = (u, n = document) => [...n.querySelectorAll(u)];
function y(u, n = {}, ...t) {
  const e = document.createElement(u);
  for (const [r, o] of Object.entries(n)) o == null || o === false || (r === "class" ? e.className = o : r === "style" && typeof o == "object" ? Object.assign(e.style, o) : r.startsWith("on") && typeof o == "function" ? e.addEventListener(r.slice(2), o) : r === "text" ? e.textContent = o : r in e && typeof o != "string" ? e[r] = o : e.setAttribute(r, o === true ? "" : String(o)));
  for (const r of t) r != null && r !== false && e.append(r);
  return e;
}
const vl = "http://www.w3.org/2000/svg";
function pt(u, n = {}) {
  const t = document.createElementNS(vl, u);
  for (const [e, r] of Object.entries(n)) r != null && t.setAttribute(e, String(r));
  return t;
}
let qr = 0;
function H(u, n = "ok", t = 2800, e) {
  const r = _e("#toast"), o = y("span", { text: u });
  r.replaceChildren(o), r.dataset.kind = n, r.hidden = false, e && r.append(y("button", { class: "toast-btn", type: "button", text: e.label, onclick: () => {
    e.run(), s();
  } })), requestAnimationFrame(() => r.classList.add("show")), clearTimeout(qr);
  const a = ++pr, s = () => {
    a === pr && (clearTimeout(qr), r.classList.remove("show"), window.setTimeout(() => {
      a === pr && (r.hidden = true);
    }, 250));
  };
  return qr = window.setTimeout(s, t), { set: (i) => {
    a === pr && (o.textContent = i);
  }, close: s };
}
let pr = 0;
function nt(u) {
  return new Promise((n) => {
    const t = _e("#modal-host"), e = (a) => {
      t.hidden = true, t.replaceChildren(), document.removeEventListener("keydown", r), n(a);
    }, r = (a) => {
      a.key === "Escape" && e(null);
    }, o = y("div", { class: "modal", role: "dialog", "aria-modal": "true", "aria-label": u.title }, y("h2", { text: u.title }), typeof u.body == "string" ? y("p", { class: "modal-text", text: u.body }) : u.body || null, y("div", { class: "modal-actions" }, ...u.actions.map((a) => y("button", { class: "btn" + (a.primary ? " primary" : "") + (a.danger ? " danger" : ""), text: a.label, onclick: () => e(a.id) }))));
    t.replaceChildren(y("div", { class: "modal-scrim", onclick: () => e(null) }), o), t.hidden = false, document.addEventListener("keydown", r), u.onOpen?.(o), o.querySelector("input,textarea,button.primary")?.focus();
  });
}
const Ve = (u) => {
  const n = y("span", { class: "ic", "aria-hidden": "true" });
  return n.innerHTML = ss[u] || "", n;
}, ue = (u) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${u}</svg>`, ss = { select: ue('<path d="M5 3l6 17 2.5-7L20 10.5z"/>'), edittext: ue('<path d="M4 6V4h12v2"/><path d="M10 4v15"/><path d="M8 19h4"/><path d="M14.5 17.5l5-5 2 2-5 5H14.5z"/>'), addtext: ue('<rect x="3.5" y="5" width="17" height="14" rx="2" stroke-dasharray="2.5 2"/><path d="M8 9h8M12 9v7"/>'), highlight: ue('<path d="M8 14l-3 3v3h3l3-3"/><path d="M11.5 6.5l6 6"/><path d="M8 14l7.5-7.5a2.1 2.1 0 013 3L11 17z"/>'), underline: ue('<path d="M7 4v6a5 5 0 0010 0V4"/><path d="M5 20h14"/>'), strike: ue('<path d="M16 6.5C15 5 13.6 4.5 12 4.5c-2.5 0-4 1.3-4 3 0 4 8 2.5 8 7 0 1.8-1.7 3-4 3-1.8 0-3.4-.7-4.3-2"/><path d="M4 12h16"/>'), draw: ue('<path d="M3 17c3-1 3.5-7 6.5-7s2 6 5 6 3-4 6.5-5"/>'), rect: ue('<rect x="4" y="5.5" width="16" height="13" rx="1"/>'), ellipse: ue('<ellipse cx="12" cy="12" rx="8.5" ry="6.5"/>'), note: ue('<path d="M5 4h14v11l-5 5H5z"/><path d="M14 20v-5h5"/><path d="M8.5 9h7M8.5 12.5h4"/>'), sign: ue('<path d="M3 16c2.5 0 3-8 5.5-8S9 15 11 15s1.5-3 3.5-3 1 3 3.5 3H21"/><path d="M3 20h18"/>'), open: ue('<path d="M3.5 7a2 2 0 012-2h4l2 2.5h7a2 2 0 012 2V17a2 2 0 01-2 2h-13a2 2 0 01-2-2z"/>'), merge: ue('<path d="M7 4v5a3 3 0 003 3h4a3 3 0 013 3v5"/><path d="M17 4v5a3 3 0 01-3 3"/><path d="M14 17l3 3 3-3"/>'), save: ue('<path d="M12 4v11"/><path d="M7.5 10.5L12 15l4.5-4.5"/><path d="M5 20h14"/>'), undo: ue('<path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 010 11H11"/>'), redo: ue('<path d="M15 14l5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 000 11H13"/>'), zoomin: ue('<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L20 20M8 10.5h5M10.5 8v5"/>'), zoomout: ue('<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L20 20M8 10.5h5"/>'), fit: ue('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'), search: ue('<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L20 20"/>'), up: ue('<path d="M6 15l6-6 6 6"/>'), arrange: ue('<rect x="6.5" y="6.5" width="11" height="11" stroke-dasharray="2 2"/><path d="M3 3h4M3 3v4M21 3h-4M21 3v4M3 21h4M3 21v-4M21 21h-4M21 21v-4"/>'), alignl: ue('<path d="M4 6h16M4 10h10M4 14h16M4 18h10"/>'), alignc: ue('<path d="M4 6h16M7 10h10M4 14h16M7 18h10"/>'), alignr: ue('<path d="M4 6h16M10 10h10M4 14h16M10 18h10"/>'), left: ue('<path d="M15 6l-6 6 6 6"/>'), right: ue('<path d="M9 6l6 6-6 6"/>'), down: ue('<path d="M6 9l6 6 6-6"/>'), close: ue('<path d="M6 6l12 12M18 6L6 18"/>'), rotl: ue('<path d="M4 4v5h5"/><path d="M4.5 9A8 8 0 1112 20"/>'), rotr: ue('<path d="M20 4v5h-5"/><path d="M19.5 9A8 8 0 1012 20"/>'), trash: ue('<path d="M4 7h16M10 11v6M14 11v6"/><path d="M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12"/><path d="M9 7V4h6v3"/>'), plus: ue('<path d="M12 5v14M5 12h14"/>'), extract: ue('<path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M14 3v6h6"/><path d="M12 18v-6M9 15l3 3 3-3"/>'), pages: ue('<rect x="4" y="3" width="11" height="14" rx="1.5"/><path d="M9 21h9a2 2 0 002-2V8"/>'), comments: ue('<path d="M4 5h16v11H9l-5 4z"/>'), image: ue('<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M20 16l-5-5-8 8"/>'), line: ue('<path d="M5 19L19 5"/><path d="M11 5h8v8"/>'), textbox: ue('<rect x="3.5" y="4.5" width="17" height="12" rx="1.5"/><path d="M7 8.5h10M7 12.5h6"/><path d="M8 16.5l-2 4"/>'), stamp: ue('<path d="M9 11V6a3 3 0 016 0v5"/><path d="M5 11h14l-1 5H6z"/><path d="M4 20h16"/>'), watermark: ue('<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 16l8-8" stroke-width="2.6" opacity=".45"/>'), replace: ue('<path d="M4 7h11l-3-3M20 17H9l3 3"/>'), link: ue('<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/>'), alignj: ue('<path d="M4 6h16M4 10h16M4 14h16M4 18h16"/>'), more: ue('<circle cx="5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="19" cy="12" r="1.6" fill="currentColor"/>'), image2: ue('<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="M21 16l-5-5-8 8"/>'), "al-left": ue('<path d="M4 3v18"/><rect x="7" y="6" width="11" height="4" rx="1"/><rect x="7" y="14" width="7" height="4" rx="1"/>'), "al-hcenter": ue('<path d="M12 3v18"/><rect x="5" y="6" width="14" height="4" rx="1"/><rect x="8" y="14" width="8" height="4" rx="1"/>'), "al-right": ue('<path d="M20 3v18"/><rect x="6" y="6" width="11" height="4" rx="1"/><rect x="10" y="14" width="7" height="4" rx="1"/>'), "al-top": ue('<path d="M3 4h18"/><rect x="6" y="7" width="4" height="11" rx="1"/><rect x="14" y="7" width="4" height="7" rx="1"/>'), "al-vmiddle": ue('<path d="M3 12h18"/><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="8" width="4" height="8" rx="1"/>'), "al-bottom": ue('<path d="M3 20h18"/><rect x="6" y="6" width="4" height="11" rx="1"/><rect x="14" y="10" width="4" height="7" rx="1"/>'), "dist-h": ue('<path d="M3 4v16M21 4v16"/><rect x="9" y="7" width="6" height="10" rx="1"/>'), "dist-v": ue('<path d="M4 3h16M4 21h16"/><rect x="7" y="9" width="10" height="6" rx="1"/>'), "match-w": ue('<rect x="4" y="5" width="16" height="5" rx="1"/><rect x="4" y="14" width="16" height="5" rx="1" stroke-dasharray="2 2"/>'), "match-h": ue('<rect x="5" y="4" width="5" height="16" rx="1"/><rect x="14" y="4" width="5" height="16" rx="1" stroke-dasharray="2 2"/>'), "match-both": ue('<rect x="3" y="3" width="9" height="9" rx="1"/><rect x="12" y="12" width="9" height="9" rx="1" stroke-dasharray="2 2"/>'), "z-front": ue('<rect x="4" y="4" width="10" height="10" rx="1" opacity=".45"/><rect x="10" y="10" width="10" height="10" rx="1" fill="currentColor" fill-opacity=".35"/>'), "z-forward": ue('<rect x="4" y="4" width="10" height="10" rx="1" opacity=".45"/><rect x="10" y="10" width="10" height="10" rx="1"/><path d="M15 3l3 3-3 3"/>'), "z-backward": ue('<rect x="10" y="10" width="10" height="10" rx="1" opacity=".45"/><rect x="4" y="4" width="10" height="10" rx="1"/><path d="M9 21l-3-3 3-3"/>'), "z-back": ue('<rect x="10" y="10" width="10" height="10" rx="1"/><rect x="4" y="4" width="10" height="10" rx="1" fill="currentColor" fill-opacity=".35" opacity=".45"/>'), print: ue('<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>'), copy: ue('<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2"/>'), paste: ue('<path d="M9 4h6v3H9z"/><path d="M9 5.5H7a2 2 0 0 0-2 2V19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7.5a2 2 0 0 0-2-2h-2"/><path d="M9 13h6M9 16.5h4"/>'), lock: ue('<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/><path d="M12 14.5v2" stroke-width="2.2"/>'), flatten: ue('<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5" opacity=".55"/><path d="M3 17.5l9 5 9-5" opacity=".3"/>'), redact: ue('<rect x="3" y="6" width="18" height="5" rx="1" fill="currentColor" stroke="none"/><path d="M3 15h8M3 19h13"/>'), formfield: ue('<rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="6" height="6" rx="1"/><path d="M4.5 17l1.3 1.3L8 15.5M12 17h8"/>'), listb: ue('<circle cx="5" cy="7" r="1.3" fill="currentColor" stroke="none"/><circle cx="5" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="5" cy="17" r="1.3" fill="currentColor" stroke="none"/><path d="M9.5 7H20M9.5 12H20M9.5 17H20"/>'), listn: ue('<path d="M4 5.5h1.5V9M4 9h3M4 14.5c0-1 2.8-1 2.8.3 0 1.2-2.8 1.6-2.8 3.2h3"/><path d="M10 7H20M10 12H20M10 17H20"/>'), fliph: ue('<path d="M12 3v18" stroke-dasharray="2 2"/><path d="M9 7L4 17h5zM15 7l5 10h-5z"/>'), flipv: ue('<path d="M3 12h18" stroke-dasharray="2 2"/><path d="M7 9L17 4v5zM7 15l10 5v-5z"/>'), crop: ue('<path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/>'), hf: ue('<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M7 6.5h10M7 17.5h4M15 17.5h2"/><path d="M7 10.5h10M7 13.5h7" opacity=".45"/>'), form: ue('<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>') }, gn = ["hl", "hc", "hr", "fl", "fc", "fr"], xl = { text: { hl: "", hc: "", hr: "", fl: "{file}", fc: "", fr: "Page {page} of {pages}" }, fontKey: "sarabun", size: 9, color: [90, 94, 104, 255], margin: 28, range: "all", from: 1, to: 1, start: 1, thaiDigits: false, images: {}, imageHeight: 24 }, Al = "๐๑๒๓๔๕๖๗๘๙", kl = () => (/* @__PURE__ */ new Date()).toLocaleDateString(void 0, { year: "numeric", month: "short", day: "numeric" });
function El(u, n, t) {
  const e = u.replace(/\{(page|pages|date|file)\}/g, (r, o) => n[o]);
  return t ? e.replace(/[0-9]/g, (r) => Al[+r]) : e;
}
async function Sl(u, n) {
  const t = new Image();
  t.src = u, await t.decode();
  const e = (t.naturalWidth || 1) / (t.naturalHeight || 1), r = Math.max(8, Math.min(1200, Math.round(n * 4))), o = Math.max(8, Math.min(2400, Math.round(r * e))), a = document.createElement("canvas");
  a.width = o, a.height = r;
  const s = a.getContext("2d");
  return s.drawImage(t, 0, 0, o, r), { rgba: s.getImageData(0, 0, o, r).data, w: o, h: r, aspect: e };
}
function is(u, n) {
  for (const t of n) for (const e of gn) gt(u.doc, t, "hf-" + e);
}
function ls(u, n) {
  const t = n.range === "skipFirst" ? 1 : n.range === "custom" ? Math.max(0, n.from - 1) : 0, e = n.range === "custom" ? Math.min(u - 1, n.to - 1) : u - 1, r = [];
  for (let o = t; o <= e; o++) r.push(o);
  return { pages: r, first: t, total: n.start + r.length - 1 };
}
const Cn = /* @__PURE__ */ new Map();
async function cs(u) {
  const n = {};
  for (const t of gn) {
    const e = u.images?.[t];
    if (!e) continue;
    const r = u.imageHeight + "|" + e;
    let o = Cn.get(r);
    o || (o = Sl(e, u.imageHeight), Cn.set(r, o), Cn.size > 24 && Cn.delete(Cn.keys().next().value)), n[t] = await o.catch(() => {
      throw Cn.delete(r), new Error("One of the images could not be read");
    });
  }
  return n;
}
async function us(u, n, t, e, r, o, a) {
  const s = { page: String(t), pages: String(e), date: kl(), file: r }, { w: i, h: l } = u.pageSize(n), h = u.transform(n, i, l).invert(), [m, _] = h.apply(0, 0), [p, P] = h.apply(1, 0), [D, x] = h.apply(0, 1), A = p - m, w = P - _, k = -(D - m), G = -(x - _);
  for (const E of gn) {
    const B = El(o.text[E] || "", s, o.thaiDigits).trim(), z = a[E];
    if (!B && !z) continue;
    const O = o.imageHeight, W = z ? O * z.aspect : 0, N = z && B ? o.size * 0.6 : 0, V = B ? await os(o.fontKey, B, o.size) : 0, q = W + N + V, Y = E[1] === "l" ? o.margin : E[1] === "c" ? (i - q) / 2 : i - o.margin - q, ne = Math.max(z ? O : 0, o.size), J = E[0] === "h" ? o.margin : l - o.margin - ne, ee = "hf-" + E;
    if (z) {
      const ae = J + (ne - O) / 2, [de, oe] = h.apply(Y, ae + O);
      gl(u, n, z.rgba, z.w, z.h, [A * W, w * W, k * O, G * O, de, oe], ee);
    }
    if (B) {
      const ae = z ? J + ne / 2 + o.size * 0.35 : E[0] === "h" ? o.margin + o.size * 0.8 : l - o.margin, [de, oe] = h.apply(Y + W + N, ae);
      await Tr(u, n, { lines: [B], fontKey: o.fontKey, size: o.size, color: o.color, matrix: [A, w, k, G, de, oe], id: ee });
    }
  }
}
const hs = (u) => u.fileName.replace(/\.pdf$/i, "");
async function Cl(u, n) {
  const t = u.doc, e = t.pageCount, { pages: r, total: o } = ls(e, n);
  if (!r.length) throw new Error("That page range is empty");
  const a = await cs(n);
  is(u, [...Array(e).keys()]);
  for (const [s, i] of r.entries()) await us(t, i, n.start + s, o, hs(u), n, a);
  return r.length;
}
async function Ml(u, n, t, e) {
  const { pages: r, first: o, total: a } = ls(u.doc.pageCount, t), s = u.lib.create();
  try {
    s.importIndices(u.doc, [n], 0);
    for (const _ of gn) gt(s, 0, "hf-" + _);
    const i = r.includes(n);
    i && await us(s, 0, t.start + (n - o), a, hs(u), t, await cs(t));
    const { w: l, h } = s.pageSize(0), m = e / l * Math.min(2, devicePixelRatio || 1);
    return { img: s.render(0, l * m, h * m), w: l, h, scale: m, inRange: i };
  } finally {
    s.close();
  }
}
async function Gl(u, n, t) {
  const e = JSON.parse(JSON.stringify(n));
  e.images ||= {}, e.imageHeight ||= 24;
  const r = u.doc.pageCount;
  (e.to < 1 || e.to > r) && (e.to = r);
  const o = {};
  let a = () => {
  };
  const s = (ce, Ge) => {
    const ge = (ce[0] === "h" ? "Header " : "Footer ") + Ge.toLowerCase(), $e = y("input", { class: "tinput", id: "hf-" + ce, type: "text", value: e.text[ce], placeholder: Ge, "aria-label": ge + " text" });
    $e.addEventListener("focus", () => i = $e), o[ce] = $e;
    const Ce = y("input", { type: "file", accept: "image/png,image/jpeg,image/webp,image/svg+xml", hidden: true, id: "hf-img-" + ce }), Ee = y("button", { class: "hf-img", type: "button", title: "Add an image", "aria-label": ge + " image" }), Oe = y("button", { class: "hf-img-x", type: "button", title: "Remove image", "aria-label": "Remove " + ge + " image", text: "×" }), Ke = () => {
      const Xe = e.images[ce];
      Ee.replaceChildren(Xe ? y("img", { src: Xe, alt: "" }) : Ve("image")), Ee.classList.toggle("has", !!Xe), Oe.hidden = !Xe;
    };
    return Ee.addEventListener("click", () => Ce.click()), Oe.addEventListener("click", () => {
      delete e.images[ce], Ke();
    }), Ce.addEventListener("change", () => {
      const Xe = Ce.files?.[0];
      if (Ce.value = "", !Xe) return;
      if (Xe.size > 4 * 1024 * 1024) return H("Choose an image under 4 MB", "warn");
      const dt = new FileReader();
      dt.onload = () => {
        e.images[ce] = String(dt.result), Ke(), a();
      }, dt.readAsDataURL(Xe);
    }), Ke(), y("div", { class: "hf-slot" }, $e, Ee, Oe, Ce);
  };
  let i = null;
  const l = (ce, Ge) => y("button", { class: "chip", type: "button", text: Ge, onclick: () => {
    const ge = i || o.fr, $e = ge.selectionStart ?? ge.value.length, Ce = ge.selectionEnd ?? $e;
    ge.value = ge.value.slice(0, $e) + ce + ge.value.slice(Ce), ge.focus(), ge.setSelectionRange($e + ce.length, $e + ce.length);
  } }), h = y("select", { class: "rselect", id: "hf-font", "aria-label": "Font" }, ...["Thai + Latin", "Latin", "Standard"].map((ce) => y("optgroup", { label: ce }, ...sn.filter((Ge) => Ge.group === ce).map((Ge) => y("option", { value: Ge.key, text: Ge.label, selected: Ge.key === e.fontKey }))))), m = (ce, Ge, ge, $e, Ce) => y("input", { class: "rnum", id: ce, type: "number", value: String(Ge), min: String(ge), max: String($e), "aria-label": Ce }), _ = m("hf-size", e.size, 5, 36, "Font size"), p = m("hf-margin", e.margin, 6, 144, "Margin from page edge"), P = m("hf-start", e.start, 0, 99999, "First page number"), D = m("hf-imgh", e.imageHeight, 6, 120, "Image height"), x = m("hf-from", e.from, 1, r, "From page"), A = m("hf-to", e.to, 1, r, "To page"), w = y("select", { class: "rselect", id: "hf-range", "aria-label": "Pages" }, y("option", { value: "all", text: `All ${r} pages`, selected: e.range === "all" }), y("option", { value: "skipFirst", text: "All except the first page", selected: e.range === "skipFirst" }), y("option", { value: "custom", text: "Page range", selected: e.range === "custom" })), k = y("span", { class: "withunit" }, x, y("span", { class: "unit", text: "to" }), A), G = () => {
    k.hidden = w.value !== "custom";
  };
  w.addEventListener("change", G), G();
  const E = y("input", { type: "checkbox", id: "hf-thai", checked: e.thaiDigits }), B = (ce) => y("button", { class: "sw" + (ce.join() === e.color.join() ? " on" : ""), type: "button", "aria-label": `rgb ${ce.slice(0, 3).join(" ")}`, style: { background: `rgb(${ce[0]},${ce[1]},${ce[2]})` }, onclick: (Ge) => {
    e.color = ce, Ge.currentTarget.parentElement.querySelectorAll(".sw").forEach((ge) => ge.classList.remove("on")), Ge.currentTarget.classList.add("on");
  } }), z = (ce, ...Ge) => y("div", { class: "hf-row" }, y("span", { class: "rlabel", text: ce }), y("div", { class: "hf-ctrl" }, ...Ge)), O = y("div", { class: "hf" }, y("div", { class: "hf-grid" }, y("span", { class: "rlabel", text: "Header" }), s("hl", "Left"), s("hc", "Center"), s("hr", "Right"), y("span", { class: "rlabel", text: "Footer" }), s("fl", "Left"), s("fc", "Center"), s("fr", "Right")), y("div", { class: "hf-tokens" }, y("span", { class: "hint", text: "Insert:" }), l("{page}", "Page number"), l("{pages}", "Page count"), l("{date}", "Date"), l("{file}", "File name")), z("Text", h, y("span", { class: "withunit" }, _, y("span", { class: "unit", text: "pt" })), y("div", { class: "swatches" }, ...[[90, 94, 104, 255], [24, 26, 33, 255], [214, 69, 52, 255], [37, 99, 235, 255]].map(B))), z("Pages", w, k), z("Numbering", y("span", { class: "withunit" }, y("span", { class: "unit", text: "Start at" }), P), y("label", { class: "hf-check" }, E, "Thai digits (๑ ๒ ๓)")), z("Images", y("span", { class: "withunit" }, y("span", { class: "unit", text: "Height" }), D, y("span", { class: "unit", text: "pt" })), y("span", { class: "hint", text: "Use the image button beside a position. Images sit before that position’s text." })), z("Margin", y("span", { class: "withunit" }, p, y("span", { class: "unit", text: "pt from the edge" })))), W = () => {
    for (const ce of gn) e.text[ce] = o[ce].value;
    e.fontKey = h.value, e.size = Math.max(5, Math.min(36, +_.value || 9)), e.margin = Math.max(6, Math.min(144, +p.value || 28)), e.imageHeight = Math.max(6, Math.min(120, +D.value || 24)), e.start = Math.max(0, Math.round(+P.value || 1)), e.range = w.value, e.from = Math.max(1, Math.min(r, +x.value || 1)), e.to = Math.max(e.from, Math.min(r, +A.value || r)), e.thaiDigits = E.checked;
  };
  let N = Math.min(u.currentPage, r - 1);
  const V = y("canvas", { class: "hf-strip", "aria-label": "Preview of the top of the page" }), q = y("canvas", { class: "hf-strip", "aria-label": "Preview of the bottom of the page" }), Y = y("span", { class: "mono", text: "" }), ne = y("span", { class: "hint", text: "" }), J = (ce) => y("button", { class: "iconbtn small", type: "button", "aria-label": ce < 0 ? "Previous page" : "Next page", onclick: () => {
    N = Math.max(0, Math.min(r - 1, N + ce)), fe();
  } }, Ve(ce < 0 ? "left" : "right")), ee = y("div", { class: "hf-preview" }, y("div", { class: "hf-pv-head" }, y("span", { class: "rlabel", text: "Preview" }), J(-1), Y, J(1), ne), y("div", { class: "hf-band" }, V), y("div", { class: "hf-gap", "aria-hidden": "true" }), y("div", { class: "hf-band" }, q));
  O.append(ee);
  let ae = 0, de = 0;
  const oe = async () => {
    const ce = ++de;
    W(), Y.textContent = `Page ${N + 1} of ${r}`;
    const Ge = Math.max(240, ee.clientWidth || 600);
    try {
      const ge = await Ml(u, N, e, Ge);
      if (ce !== de) return;
      ne.textContent = ge.inRange ? "" : "This page is outside the chosen range.";
      const $e = Math.min(ge.h / 2, e.margin + Math.max(e.size, gn.some((Oe) => e.images[Oe]) ? e.imageHeight : 0) + 18), Ce = Math.round($e * ge.scale), Ee = document.createElement("canvas");
      Ee.width = ge.img.width, Ee.height = ge.img.height, Ee.getContext("2d").putImageData(ge.img, 0, 0);
      for (const [Oe, Ke] of [[V, 0], [q, ge.img.height - Ce]]) Oe.width = ge.img.width, Oe.height = Ce, Oe.style.aspectRatio = `${ge.img.width} / ${Ce}`, Oe.getContext("2d").drawImage(Ee, 0, Ke, ge.img.width, Ce, 0, 0, ge.img.width, Ce);
    } catch (ge) {
      ce === de && (ne.textContent = ge.message || "Preview unavailable");
    }
  }, fe = () => {
    clearTimeout(ae), ae = window.setTimeout(oe, 220);
  };
  O.addEventListener("input", fe), O.addEventListener("change", fe), O.addEventListener("click", (ce) => {
    ce.target.closest(".sw,.chip,.hf-img-x") && fe();
  }), a = fe;
  const we = await nt({ title: "Header & footer", onOpen: () => requestAnimationFrame(() => oe()), body: O, actions: [{ id: "remove", label: "Remove from all pages" }, { id: "cancel", label: "Cancel" }, { id: "apply", label: "Apply", primary: true }] });
  if (we === "remove") {
    await u.mutate("Remove header & footer", { pages: "all" }, () => is(u, [...Array(u.doc.pageCount).keys()])).catch((ce) => H(ce.message, "err")), H("Removed header and footer");
    return;
  }
  if (clearTimeout(ae), de++, we === "apply") {
    if (W(), t(e), !gn.some((ce) => e.text[ce].trim() || e.images[ce])) return H("Add text or an image to at least one position", "warn");
    try {
      let ce = 0;
      await u.mutate("Header & footer", { pages: "all" }, async () => {
        ce = await Cl(u, e);
      }), H(`Header and footer added to ${ce} page${ce === 1 ? "" : "s"}`);
    } catch (ce) {
      H(ce.message, "err");
    }
  }
}
const ds = { kind: "text", text: "CONFIDENTIAL", fontKey: "sarabun", color: [196, 40, 40, 255], image: "", opacity: 22, angle: 45, scale: 70, behind: false, range: "all", from: 1, to: 1, bg: false, bgColor: [255, 251, 235, 255] }, In = "wm", bn = "bg";
function ms(u, n) {
  const t = n.range === "custom" ? Math.max(1, n.from) : 1, e = n.range === "custom" ? Math.min(u, n.to) : u, r = [];
  for (let o = t - 1; o <= e - 1; o++) r.push(o);
  return r;
}
async function fs(u, n = 1600) {
  const t = new Image();
  t.src = u, await t.decode();
  const e = Math.min(1, n / Math.max(t.naturalWidth, t.naturalHeight)), r = Math.max(1, Math.round(t.naturalWidth * e)), o = Math.max(1, Math.round(t.naturalHeight * e)), a = document.createElement("canvas");
  a.width = r, a.height = o;
  const s = a.getContext("2d");
  return s.drawImage(t, 0, 0, r, o), { data: s.getImageData(0, 0, r, o).data, w: r, h: o };
}
function Tl(u, n, t) {
  return u.pageObjects(n).filter((e) => e.blockId === t).length;
}
async function _s(u, n, t, e) {
  gt(u, n, In), gt(u, n, bn);
  const { w: r, h: o } = u.pageSize(n), a = u.transform(n, r, o).invert(), s = r / 2, i = o / 2, l = t.angle * Math.PI / 180, h = Math.cos(l), m = Math.sin(l), _ = Math.min(Math.abs(h) > 1e-6 ? r / Math.abs(h) : 1 / 0, Math.abs(m) > 1e-6 ? o / Math.abs(m) : 1 / 0) * (t.scale / 100), p = (x, A) => a.apply(s + x * h - A * m, i - (x * m + A * h));
  if (t.bg) {
    const x = a.apply(0, 0), A = a.apply(r, o), w = u.P, k = w.FPDFPageObj_CreateNewRect(Math.min(x[0], A[0]), Math.min(x[1], A[1]), Math.abs(A[0] - x[0]), Math.abs(A[1] - x[1]));
    w.FPDFPageObj_SetFillColor(k, t.bgColor[0], t.bgColor[1], t.bgColor[2], 255), w.FPDFPath_SetDrawMode(k, 1, 0), na(u, n, k, bn, 0);
  }
  const P = Math.round(t.opacity / 100 * 255);
  let D = 0;
  if (t.kind === "text" && t.text.trim()) {
    const x = 100 * _ / Math.max(1, await Ol(t));
    D = await yl(u, t.text.trim(), t.fontKey, x, p), u.P.FPDFPageObj_SetFillColor(D, t.color[0], t.color[1], t.color[2], P);
  } else if (t.kind === "image" && e) {
    const x = e.w / e.h;
    let A = _, w = _ / x;
    const k = Math.min(r, o) * (t.scale / 100);
    w > k && (w = k, A = w * x);
    const G = new Uint8ClampedArray(e.data);
    for (let O = 3; O < G.length; O += 4) G[O] = Math.round(G[O] * (t.opacity / 100));
    const E = p(-A / 2, -w / 2), B = p(A / 2, -w / 2), z = p(-A / 2, w / 2);
    D = wl(u, G, e.w, e.h, [B[0] - E[0], B[1] - E[1], z[0] - E[0], z[1] - E[1], E[0], E[1]]);
  }
  D && na(u, n, D, In, t.behind ? Tl(u, n, bn) : -1);
}
const oa = /* @__PURE__ */ new Map();
async function Ol(u) {
  const n = u.fontKey + "|" + u.text;
  let t = oa.get(n);
  return t == null && (t = await os(cr(u.fontKey, u.text).key, u.text.trim(), 100), oa.set(n, t)), t;
}
function Rl(u) {
  for (let n = 0; n < u.doc.pageCount; n++) if (u.doc.pageObjects(n).some((t) => t.blockId === In || t.blockId === bn)) return true;
  return false;
}
async function Il(u, n) {
  const t = ms(u.doc.pageCount, n);
  if (!t.length) throw new Error("That page range is empty");
  const e = n.kind === "image" && n.image ? await fs(n.image) : null;
  if (n.kind === "image" && !e) throw new Error("Choose an image first");
  for (let r = 0; r < u.doc.pageCount; r++) gt(u.doc, r, In), gt(u.doc, r, bn);
  for (const r of t) await _s(u.doc, r, n, e);
  return t.length;
}
function Ll(u) {
  for (let n = 0; n < u.doc.pageCount; n++) gt(u.doc, n, In), gt(u.doc, n, bn);
}
async function jl(u, n, t) {
  const e = JSON.parse(JSON.stringify(n)), r = u.doc.pageCount;
  (e.to < 1 || e.to > r) && (e.to = r);
  const o = (J, ee, ae, de) => {
    const oe = y("div", { class: "swatches", role: "radiogroup", "aria-label": de }), fe = () => oe.replaceChildren(...J.map((we) => {
      const ce = ee().slice(0, 3).join() === we.slice(0, 3).join();
      return y("button", { class: "sw" + (ce ? " on" : ""), type: "button", role: "radio", "aria-checked": String(ce), "aria-label": `rgb ${we.slice(0, 3).join(" ")}`, style: { background: `rgb(${we[0]},${we[1]},${we[2]})` }, onclick: () => {
        ae(we), fe(), N();
      } });
    }));
    return fe(), oe;
  }, a = (J, ...ee) => y("div", { class: "hf-row" }, y("span", { class: "rlabel", text: J }), y("div", { class: "hf-ctrl" }, ...ee)), s = (J, ee, ae, de, oe) => {
    const fe = y("input", { type: "radio", name: J, value: ee, checked: de });
    return fe.addEventListener("change", () => {
      fe.checked && (oe(), w(), N());
    }), y("label", { class: "hf-check" }, fe, ae);
  }, i = (J, ee, ae, de, oe, fe) => {
    const we = y("input", { type: "range", min: String(J), max: String(ee), value: String(ae), "aria-label": fe, class: "wm-range" }), ce = y("span", { class: "mono", text: ae + oe });
    return we.addEventListener("input", () => {
      de(+we.value), ce.textContent = we.value + oe, N();
    }), y("span", { class: "wm-slider" }, we, ce);
  }, l = y("input", { class: "tinput", value: e.text, "aria-label": "Watermark text" });
  l.addEventListener("input", () => {
    e.text = l.value, N();
  });
  const h = y("select", { class: "rselect", "aria-label": "Font" });
  for (const J of ["Standard", "Thai + Latin", "Latin"]) h.append(y("optgroup", { label: J }, ...sn.filter((ee) => ee.group === J).map((ee) => y("option", { value: ee.key, text: ee.label, selected: ee.key === e.fontKey }))));
  h.addEventListener("change", () => {
    e.fontKey = h.value, N();
  });
  const m = y("button", { class: "btn ghost small", type: "button" }, e.image ? "Change image…" : "Choose image…"), _ = y("img", { class: "wm-thumb", alt: "", hidden: !e.image, src: e.image || void 0 });
  m.addEventListener("click", () => {
    const J = y("input", { type: "file", accept: "image/png,image/jpeg,image/webp,image/svg+xml" });
    J.addEventListener("change", () => {
      const ee = J.files?.[0];
      if (!ee) return;
      const ae = new FileReader();
      ae.onload = () => {
        e.image = String(ae.result), _.src = e.image, _.hidden = false, m.textContent = "Change image…", N();
      }, ae.readAsDataURL(ee);
    }), J.click();
  });
  const p = [a("Text", l), a("Font", h), a("Colour", o([[196, 40, 40, 255], [24, 26, 33, 255], [120, 124, 134, 255], [37, 99, 235, 255], [22, 140, 82, 255]], () => e.color, (J) => e.color = J, "Watermark colour"))], P = [a("Image", m, _)], D = y("input", { class: "rnum", type: "number", min: "1", max: String(r), value: String(e.from), "aria-label": "From page" }), x = y("input", { class: "rnum", type: "number", min: "1", max: String(r), value: String(e.to), "aria-label": "To page" });
  D.addEventListener("change", () => {
    e.from = +D.value || 1, N();
  }), x.addEventListener("change", () => {
    e.to = +x.value || r, N();
  });
  const A = y("input", { type: "checkbox", checked: e.bg });
  A.addEventListener("change", () => {
    e.bg = A.checked, N();
  });
  const w = () => {
    p.forEach((J) => J.hidden = e.kind !== "text"), P.forEach((J) => J.hidden = e.kind !== "image"), D.disabled = x.disabled = e.range !== "custom";
  }, k = y("canvas", { class: "wm-canvas", "aria-label": "Preview" });
  let G = 0;
  const E = y("span", { class: "mono" }), B = (J) => y("button", { class: "iconbtn small", type: "button", "aria-label": J < 0 ? "Previous page" : "Next page", text: J < 0 ? "‹" : "›", onclick: () => {
    G = Math.max(0, Math.min(r - 1, G + J)), N();
  } }), z = y("div", { class: "wm" }, y("div", { class: "wm-form" }, a("Watermark", s("wm-kind", "text", "Text", e.kind === "text", () => e.kind = "text"), s("wm-kind", "image", "Image", e.kind === "image", () => e.kind = "image")), ...p, ...P, a("Opacity", i(5, 100, e.opacity, (J) => e.opacity = J, "%", "Opacity")), a("Angle", i(-90, 90, e.angle, (J) => e.angle = J, "°", "Angle")), a("Size", i(10, 100, e.scale, (J) => e.scale = J, "%", "Size relative to the page")), a("Layer", s("wm-layer", "top", "Over the content", !e.behind, () => e.behind = false), s("wm-layer", "behind", "Behind the content", e.behind, () => e.behind = true)), a("Background", y("label", { class: "hf-check" }, A, "Page colour"), o([[255, 251, 235, 255], [240, 249, 255, 255], [240, 253, 244, 255], [253, 242, 248, 255], [243, 244, 246, 255]], () => e.bgColor, (J) => {
    e.bgColor = J, e.bg = true, A.checked = true;
  }, "Background colour")), a("Pages", s("wm-range", "all", "All", e.range === "all", () => e.range = "all"), s("wm-range", "custom", "From", e.range === "custom", () => e.range = "custom"), D, "to", x)), y("div", { class: "wm-preview" }, y("div", { class: "hf-pv-head" }, y("span", { class: "rlabel", text: "Preview" }), B(-1), E, B(1)), k));
  w();
  let O = 0, W = 0;
  const N = () => {
    clearTimeout(W), W = window.setTimeout(V, 120);
  }, V = async () => {
    const J = ++O;
    E.textContent = `Page ${G + 1} of ${r}`;
    const ee = u.lib.create();
    try {
      if (ee.importIndices(u.doc, [G], 0), gt(ee, 0, In), gt(ee, 0, bn), ms(r, e).includes(G)) {
        const ce = e.kind === "image" && e.image ? await fs(e.image, 600) : null;
        await _s(ee, 0, e, ce);
      }
      if (J !== O) return;
      const { w: ae, h: de } = ee.pageSize(0), oe = 300 * Math.min(2, devicePixelRatio || 1), fe = oe / ae, we = ee.render(0, ae * fe, de * fe);
      k.width = we.width, k.height = we.height, k.getContext("2d").putImageData(we, 0, 0);
    } catch (ae) {
      J === O && (E.textContent = ae.message);
    } finally {
      ee.close();
    }
  };
  V();
  const q = Rl(u), Y = await nt({ title: "Watermark & background", body: z, actions: [...q ? [{ id: "remove", label: "Remove", danger: true }] : [], { id: "cancel", label: "Cancel" }, { id: "apply", label: "Apply", primary: true }] });
  if (clearTimeout(W), O++, Y === "remove") {
    await u.mutate("Remove watermark", { pages: "all" }, () => Ll(u)).catch((J) => H(J.message, "err")), H("Removed the watermark and background");
    return;
  }
  if (Y !== "apply") return;
  if (e.kind === "text" && !e.text.trim() && !e.bg) return H("Type the watermark text first", "warn");
  t(e);
  let ne = 0;
  await u.mutate(e.kind === "text" && !e.text.trim() ? "Page background" : "Watermark", { pages: "all" }, async () => {
    ne = await Il(u, e);
  }).catch((J) => H(J.message, "err")), ne && H(`Applied to ${ne} page${ne === 1 ? "" : "s"}`);
}
const Bl = 100, Nl = /^(Add note|Highlight|Underline|Strikeout|Draw|Rectangle|Ellipse|Line|Arrow|Move annotation|Delete annotation|Edit comment|Reply|Edit reply|Delete reply|Change color|Callout|Text box|Edit text box|Delete text box|Stamp|Place signature|Sign field|Edit line|Fill field|Toggle checkbox|Choose option)$/, $l = /^(Fill field|Toggle checkbox|Choose option|Sign field)$/, Ul = 512 * 1024 * 1024, yr = 600 * 1024 * 1024, zl = (u, n) => {
  try {
    const t = localStorage.getItem("margin." + u);
    return t ? JSON.parse(t) : n;
  } catch {
    return n;
  }
}, Hl = (u, n) => {
  try {
    localStorage.setItem("margin." + u, JSON.stringify(n));
  } catch {
  }
}, Wl = { author: "Me", markupColor: [246, 214, 74, 255], lineMarkupColor: [214, 69, 52, 255], inkColor: [214, 69, 52, 255], inkWidth: 2, shapeColor: [37, 99, 235, 255], shapeWidth: 1.5, shapeFill: null, shapeOpacity: 1, lineColor: [214, 69, 52, 255], lineWidth: 2, lineEnds: "arrow", ftSize: 12, ftColor: [24, 26, 33, 255], ftFill: [255, 255, 255, 255], ftBorder: [214, 69, 52, 255], ftCallout: false, stamp: "approved", stampCustom: "", stampColor: [37, 99, 235, 255], stampDated: true, redactMode: "text", formKind: "text", formLastGroup: "", redactFill: [0, 0, 0, 255], noteColor: [246, 214, 74, 255], textColor: [24, 26, 33, 255], textFont: "sarabun", textSize: 14, textStyle: "", textAlign: "left", textLh: 1.5, hf: xl, wm: ds };
class Vl {
  lib;
  doc;
  fileName = "document.pdf";
  dirty = false;
  tool = "select";
  undoStack = [];
  redoStack = [];
  file;
  cur = 0;
  index = null;
  password = "";
  ownerPassword = "";
  rewriteNext = false;
  busy = false;
  pendingPatch = null;
  mustRewrite = false;
  listeners = [];
  toolListeners = [];
  settings = { ...Wl, ...zl("settings", {}) };
  saveSettings() {
    Hl("settings", this.settings);
  }
  selectedAnnot = null;
  selectedPages = /* @__PURE__ */ new Set();
  currentPage = 0;
  constructor(n) {
    this.lib = n;
  }
  open(n, t, e = "") {
    const r = n instanceof Yt ? n : Yt.from(n), o = this.lib.open(r.view(), e);
    this.doc && this.doc.close(), this.doc = o, this.file = r, this.cur = r.len, this.index = null, this.password = e, this.ownerPassword = "", this.mustRewrite = false, this.fileName = t, this.dirty = false, this.undoStack = [], this.redoStack = [], this.selectedAnnot = null, this.selectedPages.clear(), this.currentPage = 0, this.emit({ pages: "all", structure: true });
  }
  on(n) {
    this.listeners.push(n);
  }
  onTool(n) {
    this.toolListeners.push(n);
  }
  emit(n) {
    for (const t of this.listeners) t(n);
  }
  setTool(n) {
    this.tool = n, this.selectedAnnot = null;
    for (const t of this.toolListeners) t(n);
  }
  commit() {
    const n = this.doc, t = this.rewriteNext ? null : n.saveDelta(this.cur);
    if (!t) {
      this.rewriteNext = false, this.file = Yt.from(n.save()), this.cur = this.file.len, this.index = null, n.swap(this.file.view(), this.password, void 0, this.ownerPassword);
      return;
    }
    const e = this.file.view(this.cur);
    this.index ??= Bi(e);
    const r = /* @__PURE__ */ new Map();
    let o = Ni(e, t, this.index, r);
    if (this.pendingPatch) {
      const a = this.pendingPatch;
      this.pendingPatch = null;
      const s = a(o);
      s.length === o.length && (o = s);
    }
    this.file.writeAt(this.cur, o), this.cur = this.file.len;
    for (const [a, s] of r) this.index.set(a, s);
    n.swap(this.file.view(this.cur), this.password, void 0, this.ownerPassword);
  }
  get limits() {
    const { encrypted: n, perms: t } = this.doc.security(), e = 1340;
    return { locked: n && (t & e) !== e, perms: t };
  }
  blocked(n) {
    const { locked: t, perms: e } = this.limits;
    return !t || e & 8 || e & 32 && Nl.test(n) || e & 256 && $l.test(n) ? null : "This PDF’s permissions don’t allow that change. Unlock it with its permissions password (the lock button) to edit it.";
  }
  unlock(n) {
    return this.doc.unlockOwner(n) ? (this.ownerPassword = n, this.emit({ pages: [] }), true) : false;
  }
  async protect(n, t, e) {
    if (this.cur > yr) throw new Error("Files over 600 MB can’t be protected here: encrypting rewrites the whole file, which needs more memory than a browser tab has.");
    await this.mutate("Protect document", { pages: [] }, () => {
      if (!this.doc.setProtection(n, t, e)) throw new Error("The document could not be encrypted");
      this.password = n, this.ownerPassword = t, this.rewriteNext = true;
    });
  }
  async unprotect() {
    if (this.cur > yr) throw new Error("Protection can’t be removed from files over 600 MB here: decrypting rewrites the whole file, which needs more memory than a browser tab has.");
    await this.mutate("Remove protection", { pages: [] }, () => {
      if (!this.doc.removeProtection()) throw new Error("The protection could not be removed");
      this.password = "", this.ownerPassword = "", this.rewriteNext = true;
    });
  }
  get fileSize() {
    return this.cur;
  }
  patchNextCommit(n) {
    this.pendingPatch = n;
  }
  exportBytes() {
    if (this.cur <= yr) return this.doc.save();
    if (this.mustRewrite) throw new Error("This file is too large to save with redactions applied: the redacted content can only be removed by rewriting the whole file, which needs more memory than a browser tab has. Extract the pages you need first, then redact them.");
    return this.file.view(this.cur);
  }
  restore(n) {
    (n.file !== this.file || n.len !== this.cur) && (this.index = null), this.file = n.file, this.cur = n.len, n.pw != null && (this.password = n.pw, this.ownerPassword = n.owner ?? ""), this.doc.swap(this.file.view(this.cur), this.password, void 0, this.ownerPassword), this.selectedAnnot = null;
    const t = this.doc.pageCount;
    this.selectedPages = new Set([...this.selectedPages].filter((e) => e < t)), this.currentPage >= t && (this.currentPage = Math.max(0, t - 1));
  }
  relieveMemory(n) {
    const t = this.doc, e = t.pageCount;
    !e || t.depth || this.busy || n != null && t.loaded.has(n) || t.loaded.size * (this.cur / e) < Ul || t.swap(this.file.view(this.cur), this.password, void 0, this.ownerPassword);
  }
  trimHistory() {
    for (; this.undoStack.length > Bl; ) this.undoStack.shift();
    const n = () => {
      const t = /* @__PURE__ */ new Set();
      for (const r of [...this.undoStack, ...this.redoStack]) r.file !== this.file && t.add(r.file);
      let e = 0;
      for (const r of t) e += r.len;
      return e;
    };
    for (; this.undoStack.length && this.undoStack[0].file !== this.file && n() > 512 * 1024 * 1024; ) this.undoStack.shift();
  }
  async mutate(n, t, e) {
    const r = this.blocked(n);
    if (r) throw new Error(r);
    const o = { label: n, file: this.file, len: this.cur, change: t, pw: this.password, owner: this.ownerPassword };
    this.doc.loaded.size > 2 && !this.doc.depth && this.doc.swap(this.file.view(this.cur), this.password, void 0, this.ownerPassword), this.busy = true;
    try {
      try {
        await e(), this.commit();
      } catch (a) {
        if (this.pendingPatch = null, this.rewriteNext = false, wo(a)) throw new Error(Ha);
        try {
          this.restore(o);
        } catch {
        }
        throw a;
      }
    } finally {
      this.busy = false;
    }
    this.undoStack.push(o), this.redoStack = [], this.trimHistory(), this.dirty = true, this.emit(t);
  }
  get canUndo() {
    return this.undoStack.length > 0;
  }
  get canRedo() {
    return this.redoStack.length > 0;
  }
  get undoLabel() {
    return this.undoStack.at(-1)?.label;
  }
  get redoLabel() {
    return this.redoStack.at(-1)?.label;
  }
  undo() {
    const n = this.undoStack.pop();
    return n ? (this.redoStack.push({ label: n.label, file: this.file, len: this.cur, change: n.change, pw: this.password, owner: this.ownerPassword }), this.step(n), n.label) : null;
  }
  redo() {
    const n = this.redoStack.pop();
    return n ? (this.undoStack.push({ label: n.label, file: this.file, len: this.cur, change: n.change, pw: this.password, owner: this.ownerPassword }), this.step(n), n.label) : null;
  }
  step(n) {
    const t = this.doc.pageCount;
    this.restore(n), this.dirty = true;
    const e = n.change;
    this.emit(this.doc.pageCount !== t || e.structure || e.pages === "all" ? { pages: "all", structure: e.structure || this.doc.pageCount !== t } : { pages: [...e.pages] });
  }
  replaceDoc(n) {
    this.restore({ file: Yt.from(n), len: n.length });
  }
  get editedName() {
    return this.fileName.replace(/\.pdf$/i, "") + "_edited.pdf";
  }
}
const Fr = [22, 140, 82, 255], Wn = [196, 40, 40, 255], Yr = [37, 99, 235, 255], Kl = [124, 77, 219, 255], Rn = [{ key: "approved", label: "APPROVED", color: Fr }, { key: "rejected", label: "REJECTED", color: Wn }, { key: "draft", label: "DRAFT", color: Yr }, { key: "final", label: "FINAL", color: Fr }, { key: "confidential", label: "CONFIDENTIAL", color: Wn }, { key: "forcomment", label: "FOR COMMENT", color: Yr }, { key: "received", label: "RECEIVED", color: Kl }, { key: "paid", label: "PAID", color: Fr }, { key: "void", label: "VOID", color: Wn }, { key: "th-copy", label: "สำเนาถูกต้อง", color: Yr }, { key: "th-approved", label: "อนุมัติ", color: Fr }, { key: "th-urgent", label: "ด่วน", color: Wn }, { key: "th-secret", label: "ลับ", color: Wn }];
function Xl(u) {
  const n = u.settings;
  if (n.stamp === "custom") {
    const t = n.stampCustom.trim();
    return t ? { label: t, color: n.stampColor } : null;
  }
  return Rn.find((t) => t.key === n.stamp) || Rn[0];
}
const ql = () => (/* @__PURE__ */ new Date()).toLocaleString(void 0, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
async function Yl(u, n, t) {
  const e = Xl(u);
  if (!e) return H("Type the custom stamp text first", "warn"), null;
  const r = u.settings.stampDated ? `${u.settings.author} · ${ql()}` : void 0;
  let o = null;
  return await u.mutate("Stamp", { pages: [n.index] }, async () => {
    const a = await Dl({ label: e.label, color: e.color, sub: r }, t);
    o = u.doc.addDrawnStamp(n.index, a.rect, r ? `${e.label} — ${r}` : e.label, a.content, u.settings.author);
  }).catch((a) => H(a.message, "err")), o;
}
const Jl = "image/png,image/jpeg,image/webp,image/gif,image/bmp,image/avif", Zl = (u) => /^image\/(png|jpe?g|webp|gif|bmp|avif)$/i.test(u.type) || /\.(png|jpe?g|webp|gif|bmp|avif)$/i.test(u.name), Ql = 300, ec = 4e3;
async function Eo(u, n = "Image") {
  let t;
  try {
    t = await createImageBitmap(u, { imageOrientation: "from-image" });
  } catch {
    throw new Error("That file is not an image this browser can read");
  }
  const e = /jpe?g/i.test(u.type) || /\.jpe?g$/i.test(n);
  return { bitmap: t, w: t.width, h: t.height, jpeg: e, url: URL.createObjectURL(u), name: n };
}
function aa(u, n, t, e, r) {
  let o = u.w * 0.75 * t, a = u.h * 0.75 * t;
  const s = n.w * t * 0.8, i = n.h * t * 0.8, l = Math.min(1, s / o, i / a);
  o *= l, a *= l;
  const h = n.w * t, m = n.h * t, _ = Math.max(0, Math.min(h - o, e - o / 2)), p = Math.max(0, Math.min(m - a, r - a / 2));
  return { x: _, y: p, w: o, h: a };
}
function sa(u, n, t, e, r) {
  const o = Math.abs(e - n), a = Math.abs(r - t), s = u.w / u.h, i = Math.min(o, a * s), l = i / s;
  return { x: e >= n ? n : n - i, y: r >= t ? t : t - l, w: i, h: l };
}
function ps(u, n) {
  const [t, e] = u.inv.apply(n.x, n.y + n.h), [r, o] = u.inv.apply(n.x + n.w, n.y + n.h), [a, s] = u.inv.apply(n.x, n.y);
  return [r - t, o - e, a - t, s - e, t, e];
}
async function Fs(u, n, t) {
  const e = Math.min(1, Math.max(n, t) / 72 * Ql / Math.max(u.w, u.h), ec / Math.max(u.w, u.h)), r = Math.max(1, Math.round(u.w * e)), o = Math.max(1, Math.round(u.h * e)), a = document.createElement("canvas");
  a.width = r, a.height = o;
  const s = a.getContext("2d");
  if (s.imageSmoothingQuality = "high", u.jpeg && (s.fillStyle = "#fff", s.fillRect(0, 0, r, o)), s.drawImage(u.bitmap, 0, 0, r, o), u.jpeg) {
    const i = await new Promise((l) => a.toBlob(l, "image/jpeg", 0.9));
    if (i) return { jpeg: new Uint8Array(await i.arrayBuffer()) };
  }
  return { rgba: s.getImageData(0, 0, r, o).data, w: r, h: o };
}
function gs() {
  return new Promise((u) => {
    document.querySelectorAll("input.img-file").forEach((r) => r.remove());
    const n = document.createElement("input");
    n.type = "file", n.accept = Jl, n.className = "img-file";
    let t = false;
    const e = (r) => {
      t || (t = true, n.remove(), u(r));
    };
    n.addEventListener("change", () => e(n.files?.[0] || null)), n.addEventListener("cancel", () => e(null)), n.style.display = "none", document.body.append(n), n.click();
  });
}
async function ia(u, n, t, e) {
  if (e) {
    const r = document.createElement("canvas");
    r.width = n, r.height = t, r.getContext("2d").putImageData(new ImageData(new Uint8ClampedArray(u), n, t), 0, 0);
    const o = await new Promise((a) => r.toBlob(a, "image/jpeg", 0.92));
    if (o) return { jpeg: new Uint8Array(await o.arrayBuffer()) };
  }
  return { rgba: u, w: n, h: t };
}
class tc {
  el;
  inner;
  app;
  views = [];
  zoom = 1;
  fit = "width";
  io;
  queue = /* @__PURE__ */ new Set();
  raf = 0;
  hits = [];
  activeHit = -1;
  onOverlay = () => {
  };
  onZoom = () => {
  };
  onPage = () => {
  };
  constructor(n, t) {
    this.el = n, this.app = t, this.inner = y("div", { class: "pages" }), n.append(this.inner), this.io = new IntersectionObserver((e) => {
      for (const r of e) {
        const o = this.views[+r.target.dataset.index];
        o && (o.visible = r.isIntersecting, o.visible && (o.dirty || o.renderedAt !== this.scaleKey()) && this.schedule(o.index), o.visible && o.ovStale && this.overlayOf(o));
      }
    }, { root: n, rootMargin: "600px 0px" }), new ResizeObserver(() => {
      this.fit && this.applyFit();
    }).observe(n), n.addEventListener("scroll", () => this.trackPage(), { passive: true }), n.addEventListener("wheel", (e) => {
      (e.ctrlKey || e.metaKey) && (e.preventDefault(), this.setZoom(this.zoom * Math.exp(-e.deltaY * 22e-4), { x: e.clientX, y: e.clientY }));
    }, { passive: false });
  }
  scaleKey() {
    return Math.round(this.zoom * 1e3) * 10 + Math.min(3, Math.round(devicePixelRatio || 1));
  }
  rebuild() {
    let n = null;
    const t = this.el.scrollTop;
    for (const r of this.views) {
      const o = r.wrap.offsetTop, a = r.wrap.offsetHeight + 22;
      if (t < o + a) {
        n = { page: r.index, frac: Math.max(0, (t - o) / a), left: this.el.scrollLeft };
        break;
      }
    }
    this.io.disconnect(), this.inner.replaceChildren(), this.views = [];
    const e = this.app.doc;
    for (let r = 0; r < e.pageCount; r++) {
      const { w: o, h: a } = e.pageSize(r), s = y("canvas", { class: "pdf", "aria-label": `Page ${r + 1}` }), i = y("div", { class: "hits" }), l = pt("svg", { class: "preview" }), h = y("div", { class: "ov" }), m = y("div", { class: "page", "data-index": String(r) }, s, i, l, h, y("span", { class: "pnum", text: `${r + 1}` }));
      this.inner.append(m);
      const _ = this.makeView({ index: r, wrap: m, canvas: s, ov: h, hits: i, svg: l, w: o, h: a, renderedAt: 0, dirty: true, visible: false });
      this.views.push(_), this.io.observe(m);
    }
    if (this.fit ? this.applyFit() : this.layout(), n && this.views.length) {
      const r = this.views[Math.min(n.page, this.views.length - 1)];
      this.el.scrollTop = r.wrap.offsetTop + n.frac * (r.wrap.offsetHeight + 22), this.el.scrollLeft = n.left;
    }
  }
  invalidate(n) {
    const t = n === "all" ? this.views : n.map((e) => this.views[e]).filter(Boolean);
    for (const e of t) {
      const { w: r, h: o } = this.app.doc.pageSize(e.index), a = r !== e.w || o !== e.h;
      e.w = r, e.h = o, e.dirty = true, e.annots = e.fields = e.texts = void 0, a ? this.sizeView(e) : this.overlayOf(e), e.visible && this.schedule(e.index);
    }
  }
  applyFit() {
    if (!this.views.length) return;
    const n = this.el.clientWidth - 48, t = Math.max(...this.views.map((r) => r.w));
    let e = n / t;
    if (this.fit === "page") {
      const r = Math.max(...this.views.map((o) => o.h));
      e = Math.min(e, (this.el.clientHeight - 48) / r);
    }
    this.zoom = Math.max(0.2, Math.min(e, 2.5)), this.layout();
  }
  setZoom(n, t) {
    n = Math.max(0.2, Math.min(6, n)), this.fit = null;
    const e = this.el.getBoundingClientRect(), r = t ? t.x - e.left : this.el.clientWidth / 2, o = t ? t.y - e.top : this.el.clientHeight / 2, a = (this.el.scrollLeft + r) / this.inner.scrollWidth, s = (this.el.scrollTop + o) / this.inner.scrollHeight;
    this.zoom = n, this.layout(), this.el.scrollLeft = a * this.inner.scrollWidth - r, this.el.scrollTop = s * this.inner.scrollHeight - o;
  }
  layout() {
    for (const n of this.views) this.sizeView(n);
    this.onZoom(this.zoom);
    for (const n of this.views) n.visible && this.schedule(n.index);
  }
  makeView(n) {
    let t = null, e = null;
    const r = n, o = () => {
      t = this.app.doc.transform(r.index, r.w * this.zoom, r.h * this.zoom), e = t.invert();
    };
    return Object.defineProperties(r, { tf: { get: () => (t || o(), t), set: (a) => {
      t = a, e = a ? a.invert() : null;
    }, enumerable: true }, inv: { get: () => (e || o(), e), enumerable: true } }), r;
  }
  sizeView(n) {
    const t = n.w * this.zoom, e = n.h * this.zoom;
    n.wrap.style.width = t + "px", n.wrap.style.height = e + "px", n.svg.setAttribute("viewBox", `0 0 ${t} ${e}`), n.tf = null, this.overlayOf(n), this.drawHits(n);
  }
  overlayOf(n) {
    n.visible ? (n.ovStale = false, this.onOverlay(n)) : (n.ovStale = true, n.ov.replaceChildren());
  }
  schedule(n) {
    this.queue.add(n), this.raf || (this.raf = requestAnimationFrame(() => this.flush()));
  }
  flush() {
    this.raf = 0;
    const n = [...this.queue].filter((r) => this.views[r]?.visible);
    if (!n.length) {
      this.queue.clear();
      return;
    }
    const t = this.el.scrollTop + this.el.clientHeight / 2;
    n.sort((r, o) => Math.abs(this.views[r].wrap.offsetTop - t) - Math.abs(this.views[o].wrap.offsetTop - t));
    const e = n[0];
    this.queue.delete(e), this.renderView(this.views[e]), this.queue.size && (this.raf = requestAnimationFrame(() => this.flush()));
  }
  renderView(n) {
    const t = Math.min(3, devicePixelRatio || 1);
    let e = n.w * this.zoom * t, r = n.h * this.zoom * t;
    const o = 4096 / Math.max(e, r);
    o < 1 && (e *= o, r *= o), this.app.relieveMemory(n.index);
    const a = this.app.doc.render(n.index, e, r);
    n.canvas.width = a.width, n.canvas.height = a.height, n.canvas.getContext("2d").putImageData(a, 0, 0), n.renderedAt = this.scaleKey(), n.dirty = false;
  }
  trackPage() {
    const n = this.el.scrollTop + this.el.clientHeight * 0.35;
    let t = 0;
    for (const e of this.views) if (e.wrap.offsetTop <= n) t = e.index;
    else break;
    t !== this.app.currentPage && (this.app.currentPage = t, this.onPage(t));
  }
  scrollToPage(n, t) {
    const e = this.views[n];
    if (!e) return;
    let r = e.wrap.offsetTop - 16;
    if (t) {
      const o = e.tf.box(t);
      r = e.wrap.offsetTop + o.y - this.el.clientHeight / 3, this.el.scrollTo({ left: Math.max(0, e.wrap.offsetLeft + o.x - 40), top: r, behavior: "smooth" });
      return;
    }
    this.el.scrollTo({ top: r, behavior: "smooth" });
  }
  viewTop() {
    const n = this.el.scrollTop, t = this.views.find((o) => o.wrap.offsetTop + o.wrap.offsetHeight > n + 2) || this.views[this.views.length - 1];
    if (!t) return { page: 0, y: 0 };
    const e = Math.max(0, n - t.wrap.offsetTop), [, r] = t.inv.apply(0, Math.min(e, t.wrap.offsetHeight));
    return { page: t.index, y: Math.round(Math.min(t.h, Math.max(0, r))) };
  }
  scrollToPoint(n, t) {
    const e = this.views[n];
    if (!e) return;
    const r = t == null ? 0 : Math.max(0, e.tf.apply(0, t)[1]);
    this.el.scrollTo({ top: e.wrap.offsetTop + r - (t == null ? 16 : 8), behavior: "smooth" });
  }
  annotsOf(n) {
    return n.annots ??= this.app.doc.annots(n.index).filter((t) => t.irt == null);
  }
  fieldsOf(n) {
    return n.fields ??= this.app.doc.fields(n.index);
  }
  textsOf(n) {
    return n.texts ??= this.app.doc.textObjects(n.index);
  }
  toPage(n, t) {
    const e = n.ov.getBoundingClientRect(), [r, o] = n.inv.apply(t.clientX - e.left, t.clientY - e.top);
    return { x: r, y: o };
  }
  toDev(n, t, e) {
    return n.tf.apply(t, e);
  }
  setHits(n, t) {
    this.hits = n, this.activeHit = t;
    for (const e of this.views) this.drawHits(e);
  }
  drawHits(n) {
    n.hits.replaceChildren(), this.hits.forEach((t, e) => {
      if (t.page === n.index) for (const r of t.rects) {
        const o = n.tf.box(r);
        n.hits.append(y("div", { class: "hit" + (e === this.activeHit ? " active" : ""), style: { left: o.x - 1 + "px", top: o.y - 1 + "px", width: o.w + 2 + "px", height: o.h + 2 + "px" } }));
      }
    });
  }
}
const wr = (u) => u === Q.HIGHLIGHT || u === Q.UNDERLINE || u === Q.STRIKEOUT || u === Q.SQUIGGLY, nc = 1.6, On = (u) => u.slice(0, 3).map((n) => n.toString(16).padStart(2, "0")).join(""), bs = (u) => {
  const n = parseInt((u || "000000").padEnd(6, "0").slice(0, 6), 16);
  return [n >> 16 & 255, n >> 8 & 255, n & 255, 255];
}, Ps = (u, n) => !!u.b == !!n.b && !!u.i == !!n.i && !!u.u == !!n.u && !!u.s == !!n.s && (u.c || "") === (n.c || "") && (u.f || "") === (n.f || "") && (u.z || 0) === (n.z || 0), Or = typeof Intl < "u" && Intl.Segmenter ? new Intl.Segmenter("th", { granularity: "grapheme" }) : null, la = typeof Intl < "u" && Intl.Segmenter ? new Intl.Segmenter("th", { granularity: "word" }) : null, ur = (u) => u.paras.map((n) => n.map((t) => t.t).join("")).join(`
`), rc = (u) => encodeURIComponent(JSON.stringify(u));
function Mo(u) {
  try {
    const n = JSON.parse(decodeURIComponent(u));
    return n?.v === 1 && Array.isArray(n.paras) ? n : null;
  } catch {
    return null;
  }
}
function Go(u) {
  const n = u.map((o) => o.t).join("");
  if (!n) return [{ t: "" }];
  const t = [];
  for (const o of u) for (let a = 0; a < o.t.length; a++) t.push(o);
  const e = [], r = Or ? [...Or.segment(n)] : [...n].map((o, a) => ({ segment: o, index: a }));
  for (const o of r) {
    const a = t[o.index], s = e[e.length - 1];
    if (s && Ps(s, a)) s.t += o.segment;
    else {
      const i = { t: o.segment };
      a.b && (i.b = true), a.i && (i.i = true), a.u && (i.u = true), a.s && (i.s = true), a.c && (i.c = a.c), a.f && (i.f = a.f), a.z && (i.z = a.z), e.push(i);
    }
  }
  return e;
}
function oc(u, n) {
  const t = n.st.includes("b"), e = n.st.includes("i"), r = n.st.includes("u"), o = n.st.includes("s");
  return { v: 1, paras: u.map((a) => [{ t: a, ...t ? { b: t } : {}, ...e ? { i: e } : {}, ...r ? { u: r } : {}, ...o ? { s: o } : {} }]), font: n.font, size: n.size, color: n.color, align: n.align, lh: n.lh, bm: n.bm };
}
function Ds(u) {
  const n = ze(u.font);
  return n.std && !Br(ur(u).replace(/\n/g, "")) ? ze("sarabun") : n;
}
function ys(u, n) {
  if (!n.f) return Ds(u);
  const t = ze(n.f);
  return t.std && !Br(n.t) ? ze("sarabun") : t;
}
const vr = (u, n) => n.z || u.size;
async function ac(u) {
  const n = /* @__PURE__ */ new Map(), t = async (l, h) => {
    const m = ys(u, { ...l, t: h }), _ = m.key + (l.b ? "b" : "") + (l.i ? "i" : "");
    let p = n.get(_);
    if (!p) {
      const P = on(m, { bold: l.b, italic: l.i });
      p = { face: P, l: await an(P) }, n.set(_, p);
    }
    return p;
  }, e = async (l, h) => {
    if (!h) return 0;
    const m = await t(l, l.t || h);
    return Co(m.face, m.l, h, vr(u, l));
  };
  let r = 0, o = true;
  const a = u.width && u.width > 0 ? u.width : 1 / 0, s = [];
  let i = 0;
  for (const [l, h] of u.paras.entries()) {
    const m = u.lists?.[l] || null;
    i = m === "n" ? i + 1 : 0;
    const _ = m ? u.size * nc : 0, p = a - _, P = h.length ? h : [{ t: "" }], D = P.map((O) => O.t).join(""), x = [];
    let A = 0;
    for (const O of P) x.push(A), A += O.t.length;
    const w = (O) => {
      let W = 0;
      for (; W + 1 < x.length && x[W + 1] <= O; ) W++;
      return W;
    }, k = la ? [...la.segment(D)] : D.split(/(\s+)/).filter(Boolean).reduce((O, W) => (O.push({ segment: W, index: O.length ? O[O.length - 1].index + O[O.length - 1].segment.length : 0 }), O), []), G = [];
    for (const O of k) {
      const W = [];
      let N = O.index;
      const V = O.index + O.segment.length;
      for (; N < V; ) {
        const q = w(N), Y = Math.min(V, q + 1 < x.length ? x[q + 1] : V), ne = D.slice(N, Y);
        W.push({ run: P[q], text: ne, w: await e(P[q], ne) }), N = Y;
      }
      G.push({ parts: W, w: W.reduce((q, Y) => q + Y.w, 0), space: /^\s+$/.test(O.segment) });
    }
    const E = [];
    for (const O of G) {
      if (O.w <= p || O.space) {
        E.push(O);
        continue;
      }
      let W = [], N = 0;
      for (const V of O.parts) {
        const q = Or ? [...Or.segment(V.text)].map((Y) => Y.segment) : [...V.text];
        for (const Y of q) {
          const ne = await e(V.run, Y);
          W.length && N + ne > p && (E.push({ parts: W, w: N, space: false }), W = [], N = 0);
          const J = W[W.length - 1];
          J && J.run === V.run ? (J.text += Y, J.w += ne) : W.push({ run: V.run, text: Y, w: ne }), N += ne;
        }
      }
      W.length && E.push({ parts: W, w: N, space: false });
    }
    const B = [[]];
    let z = 0;
    for (const O of E) {
      const W = B[B.length - 1];
      if (W.length && !O.space && z + O.w > p) {
        B.push([O]), z = O.w;
        continue;
      }
      !W.length && O.space && B.length > 1 || (W.push(O), z += O.w);
    }
    for (const [O, W] of B.entries()) {
      for (; W.length && W[W.length - 1].space; ) W.pop();
      const N = W.reduce((oe, fe) => oe + fe.w, 0), V = O === B.length - 1, q = p === 1 / 0 ? 0 : p - N;
      let Y = _ + (u.align === "center" ? q / 2 : u.align === "right" ? q : 0);
      const ne = u.align === "justify" && !V ? W.filter((oe) => oe.space).length : 0, J = ne ? q / ne : 0, ee = [];
      for (const oe of W) {
        for (const fe of oe.parts) {
          const we = ee[ee.length - 1];
          we && we.run === fe.run && !ne ? (we.text += fe.text, we.w += fe.w) : ee.push({ text: fe.text, run: fe.run, x: Y, w: fe.w }), Y += fe.w;
        }
        oe.space && ne && (Y += J);
      }
      const ae = ee.filter((oe) => oe.text.trim() || oe.run.u || oe.run.s);
      if (m && O === 0) {
        const oe = { t: "", ...P[0].c ? { c: P[0].c } : {}, ...P[0].b ? { b: true } : {}, ...P[0].z ? { z: P[0].z } : {}, ...P[0].f ? { f: P[0].f } : {} }, fe = m === "b" ? "•" : `${i}.`, we = await e(oe, fe);
        ae.unshift({ text: fe, run: oe, x: Math.max(0, _ - u.size * 0.45 - we), w: we });
      }
      const de = Math.max(...ae.length ? ae.map((oe) => vr(u, oe.run)) : P.map((oe) => vr(u, oe)));
      o || (r += u.lh * de), o = false, s.push({ segs: ae, width: N, para: l, lastOfPara: V, y: r, size: de });
    }
  }
  return s;
}
async function tr(u, n, t, e) {
  const r = await ac(t), o = e || "b" + Math.random().toString(36).slice(2, 9), [a, s, i, l, h, m] = t.bm;
  let _ = true;
  for (const [p, P] of r.entries()) for (const D of P.segs) {
    const x = h - i * P.y + a * D.x, A = m - l * P.y + s * D.x;
    await Tr(u, n, { lines: [D.text], fontKey: ys(t, D.run).key, size: vr(t, D.run), color: bs(D.run.c || t.color), matrix: [a, s, i, l, x, A], bold: D.run.b, italic: D.run.i, underline: D.run.u, strike: D.run.s, id: o, lineHeight: t.lh, align: "left", ln0: p, extra: _ ? { rt: rc(t) } : void 0 }), _ = false;
  }
  return _ ? { id: o, lines: 0 } : { id: o, lines: r.length };
}
function sc(u, n, t, e) {
  const r = [];
  u.paras.forEach((P, D) => {
    D && r.push({ ch: `
`, run: {} });
    for (const x of P) for (const A of x.t) r.push({ ch: A, run: x });
  });
  const o = [];
  for (const P of r) for (const D of P.ch.split("")) o.push({ ch: D, run: P.run });
  const a = o[n]?.run && o[n].ch !== `
` ? o[n].run : o[Math.max(0, n - 1)]?.run || {}, s = e.split("").map((P) => ({ ch: P, run: P === `
` ? {} : a })), i = [...o.slice(0, n), ...s, ...o.slice(t)], l = [[]];
  for (const P of i) {
    if (P.ch === `
`) {
      l.push([]);
      continue;
    }
    const D = l[l.length - 1], x = D[D.length - 1];
    x && Ps(x, P.run) ? x.t += P.ch : D.push({ ...P.run, t: P.ch });
  }
  const h = o.slice(0, n).filter((P) => P.ch === `
`).length, m = o.slice(n, t).filter((P) => P.ch === `
`).length, _ = e.split(`
`).length - 1, p = u.lists ? [...u.lists.slice(0, h + 1), ...Array(_).fill(u.lists[h] ?? null), ...u.lists.slice(h + 1 + m)] : void 0;
  return { ...u, paras: l.map(Go), ...p ? { lists: p } : {} };
}
const ic = (u) => u.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function lc(u, n, t) {
  const e = u.paras.map((o, a) => ({ inner: o.filter((i) => i.t).map((i) => {
    let l = ic(i.t);
    return i.s && (l = `<s>${l}</s>`), i.u && (l = `<u>${l}</u>`), i.i && (l = `<i>${l}</i>`), i.b && (l = `<b>${l}</b>`), i.c && i.c !== u.color && (l = `<font color="#${i.c}">${l}</font>`), i.z && i.z !== u.size && (l = `<span data-z="${i.z}" style="font-size:${n(i.z)}px">${l}</span>`), i.f && i.f !== u.font && (l = `<span data-f="${i.f}" style="font-family:${t(i.f).replace(/"/g, "&quot;")}">${l}</span>`), l;
  }).join("") || "<br>", list: u.lists?.[a] || null, first: a === 0 }));
  let r = "";
  for (let o = 0; o < e.length; ) {
    const a = e[o];
    if (a.list) {
      const s = a.list === "n" ? "ol" : "ul";
      let i = "";
      for (; o < e.length && e[o].list === a.list; ) i += `<li>${e[o++].inner}</li>`;
      r += `<${s}>${i}</${s}>`;
    } else r += a.first ? a.inner : `<div>${a.inner}</div>`, o++;
  }
  return r;
}
const ca = /* @__PURE__ */ new Set(["DIV", "P", "LI", "H1", "H2", "H3", "H4", "H5", "H6", "BLOCKQUOTE", "PRE"]);
function ua(u) {
  const n = u.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (n) return [n[1], n[2], n[3]].map((e) => (+e).toString(16).padStart(2, "0")).join("");
  const t = u.replace("#", "").trim();
  return /^[0-9a-f]{6}$/i.test(t) ? t.toLowerCase() : /^[0-9a-f]{3}$/i.test(t) ? t.split("").map((e) => e + e).join("").toLowerCase() : "";
}
function cc(u, n) {
  const t = { ...u }, e = n.tagName;
  (e === "B" || e === "STRONG") && (t.b = true), (e === "I" || e === "EM") && (t.i = true), (e === "U" || e === "INS") && (t.u = true), (e === "S" || e === "STRIKE" || e === "DEL") && (t.s = true), e === "FONT" && n.getAttribute("color") && (t.c = ua(n.getAttribute("color")) || t.c);
  const r = n.style;
  r.fontWeight && (t.b = r.fontWeight === "bold" || r.fontWeight === "bolder" || +r.fontWeight >= 600), r.fontStyle && (t.i = r.fontStyle === "italic" || r.fontStyle === "oblique");
  const o = r.textDecorationLine || r.textDecoration;
  return o && (o.includes("underline") && (t.u = true), o.includes("line-through") && (t.s = true), o === "none" && (t.u = false, t.s = false)), r.color && (t.c = ua(r.color) || t.c), n.dataset.f && (t.f = n.dataset.f), n.dataset.z && (t.z = +n.dataset.z || t.z), t;
}
function uc(u, n, t = "", e = 0) {
  const r = [], o = [];
  let a = [], s = false, i = null, l = null;
  const h = () => {
    r.push(a), o.push(l), a = [], s = false, l = i && l ? l : null;
  }, m = (_, p) => {
    const P = [..._.childNodes];
    P.forEach((D, x) => {
      if (D.nodeType === Node.TEXT_NODE) {
        const k = (D.textContent || "").replace(/\u00a0/g, " ").replace(/\u200b/g, "");
        if (k) {
          const G = { t: k };
          p.b && (G.b = true), p.i && (G.i = true), p.u && (G.u = true), p.s && (G.s = true), p.c && p.c !== n && (G.c = p.c), p.f && p.f !== t && (G.f = p.f), p.z && p.z !== e && (G.z = p.z), a.push(G), s = true;
        }
        return;
      }
      if (!(D instanceof HTMLElement)) return;
      if (D.tagName === "BR") {
        x === P.length - 1 && (_ === u || ca.has(_.tagName)) ? s = true : h();
        return;
      }
      const A = ca.has(D.tagName) || D.tagName === "UL" || D.tagName === "OL";
      A && (s || a.length) && h();
      const w = i;
      D.tagName === "UL" ? i = "b" : D.tagName === "OL" && (i = "n"), D.tagName === "LI" && (l = i), m(D, cc(p, D)), A && (s || a.length) && h(), D.tagName === "LI" && (l = null), i = w;
    });
  };
  return m(u, { b: false, i: false, u: false, s: false, c: n }), (s || a.length || !r.length) && h(), { paras: r, lists: o };
}
function ha(u, n, t, e) {
  const r = document.getSelection();
  if (!r || r.isCollapsed || !u.contains(r.anchorNode)) return false;
  try {
    document.execCommand("styleWithCSS", false, "false");
  } catch {
  }
  n === "f" ? document.execCommand("fontName", false, "__margin_font__") : document.execCommand("fontSize", false, "7");
  const o = [], a = [...u.querySelectorAll(n === "f" ? 'font[face="__margin_font__"]' : 'font[size="7"]')];
  for (const s of a) {
    const i = document.createElement("span");
    for (i.dataset[n] = t, i.style.setProperty(n === "f" ? "font-family" : "font-size", e), s.querySelectorAll(`[data-${n}]`).forEach((l) => {
      const h = l;
      delete h.dataset[n], h.style.removeProperty(n === "f" ? "font-family" : "font-size");
    }), s.querySelectorAll(n === "f" ? "font[face]" : "font[size]").forEach((l) => l.removeAttribute(n === "f" ? "face" : "size")); s.firstChild; ) i.append(s.firstChild);
    s.replaceWith(i), o.push(i);
  }
  if (o.length) {
    const s = document.createRange();
    s.setStartBefore(o[0]), s.setEndAfter(o[o.length - 1]), r.removeAllRanges(), r.addRange(s);
  }
  return o.length > 0;
}
const Mn = (u) => `rgb(${u[0]},${u[1]},${u[2]})`, hc = (u) => {
  const n = parseInt(u.padEnd(6, "0").slice(0, 6), 16);
  return [n >> 16 & 255, n >> 8 & 255, n & 255, 255];
}, Vn = (u, n) => Math.hypot(u.x - n.x, u.y - n.y);
class dc {
  app;
  v;
  editor = null;
  onEditor = () => {
  };
  onSelect = () => {
  };
  onNoteCreated = () => {
  };
  onFormatKey = () => {
  };
  arrange = null;
  image = null;
  crop = null;
  textbox = null;
  links = null;
  forms = null;
  lastDown = null;
  onImage = () => {
  };
  constructor(n, t) {
    this.app = n, this.v = t, t.onOverlay = (e) => this.overlay(e), t.inner.addEventListener("pointerdown", (e) => this.down(e)), this.loadSaved();
  }
  pvFrom(n) {
    const t = n.target.closest(".page");
    return t ? this.v.views[+t.dataset.index] : null;
  }
  refreshOverlays() {
    for (const n of this.v.views) this.v.overlayOf(n);
  }
  overlay(n) {
    if (this.editor?.pv === n || this.textbox?.open?.pv === n) return;
    n.ov.replaceChildren(), n.ov.dataset.tool = this.app.tool;
    const t = this.app.tool;
    if (t === "arrange") {
      this.arrange?.overlay(n);
      return;
    }
    if (t === "crop") {
      this.crop?.overlay(n);
      return;
    }
    if (t === "link") {
      this.links?.overlay(n, true);
      return;
    }
    if (t === "form") {
      this.forms?.overlay(n);
      return;
    }
    if (t === "select") {
      for (const e of this.v.annotsOf(n)) {
        const r = n.tf.box(e.rect), o = this.app.selectedAnnot?.page === n.index && this.app.selectedAnnot.index === e.index;
        n.ov.append(y("div", { class: "abox" + (o ? " sel" : "") + (wr(e.subtype) ? " markup" : ""), "data-annot": String(e.index), title: (e.contents || "").slice(0, 140), style: { left: r.x + "px", top: r.y + "px", width: Math.max(r.w, 6) + "px", height: Math.max(r.h, 6) + "px" } }));
      }
      this.fieldControls(n), this.links?.overlay(n, false);
    } else if (t === "edittext") for (const e of Pn(this.v.textsOf(n))) {
      const r = n.tf.box(e.bounds);
      n.ov.append(y("div", { class: "tbox" + (e.block ? " block" : ""), "data-obj": String(e.objs[0].index), title: "Click to edit", style: { left: r.x - 2 + "px", top: r.y - 2 + "px", width: r.w + 4 + "px", height: r.h + 4 + "px" } }));
    }
  }
  fieldControls(n) {
    for (const t of this.v.fieldsOf(n)) {
      const e = n.tf.box(t.rect), r = { left: e.x + "px", top: e.y + "px", width: e.w + "px", height: e.h + "px" }, o = (a, s) => this.app.mutate(a, { pages: [n.index] }, s).catch((i) => H(i.message, "err"));
      if (t.type === ye.TEXT) {
        const a = Math.max(9, Math.min(e.h * 0.62, 18)) + "px", s = t.multiline ? y("textarea", { class: "fld", "aria-label": t.name || "Text field", disabled: t.readOnly, style: { ...r, fontSize: a } }) : y("input", { class: "fld", type: "text", "aria-label": t.name || "Text field", disabled: t.readOnly, style: { ...r, fontSize: a } });
        s.value = t.value, s.addEventListener("pointerdown", (i) => i.stopPropagation()), s.addEventListener("keydown", (i) => {
          i.key === "Enter" && !t.multiline && s.blur(), i.stopPropagation();
        }), s.addEventListener("change", () => {
          const i = s.value;
          this.app.mutate("Fill field", { pages: [n.index] }, async () => {
            this.app.doc.setFieldText(n.index, t.index, i), ar(i) && await ns(this.app.doc, n.index, t.index, i);
          }).catch((l) => H(l.message, "err"));
        }), n.ov.append(s);
      } else if (t.type === ye.CHECKBOX || t.type === ye.RADIO) {
        const a = y("button", { class: "fld toggle", type: "button", role: t.type === ye.RADIO ? "radio" : "checkbox", "aria-checked": String(t.checked), "aria-label": t.name || "Option", disabled: t.readOnly, style: r });
        a.addEventListener("pointerdown", (s) => s.stopPropagation()), a.addEventListener("click", () => o(t.type === ye.RADIO ? "Choose option" : "Toggle checkbox", () => this.app.doc.clickField(n.index, t.index))), n.ov.append(a);
      } else if (t.type === ye.SIGNATURE) {
        const a = { x: (t.rect.l + t.rect.r) / 2, y: (t.rect.b + t.rect.t) / 2 };
        if (this.v.annotsOf(n).some((l) => l.subtype === Q.STAMP && l.rect.l <= a.x && l.rect.r >= a.x && l.rect.b <= a.y && l.rect.t >= a.y) || t.readOnly) continue;
        const i = y("button", { class: "fld sigfld", type: "button", "aria-label": `Sign “${t.name || "signature"}”`, title: "Click to sign", style: r }, y("span", { text: "Sign here" }));
        i.addEventListener("pointerdown", (l) => l.stopPropagation()), i.addEventListener("click", () => this.signField(n, t.rect)), n.ov.append(i);
      } else if (t.type === ye.COMBO || t.type === ye.LIST) {
        const a = y("select", { class: "fld", "aria-label": t.name || "Choice", disabled: t.readOnly, style: r }, ...t.options.map((s, i) => y("option", { value: String(i), text: s.label, selected: s.selected })));
        a.addEventListener("pointerdown", (s) => s.stopPropagation()), a.addEventListener("change", () => o("Choose option", () => this.app.doc.selectOption(n.index, t.index, +a.value))), n.ov.append(a);
      }
    }
  }
  down(n) {
    if (n.button !== 0) return;
    const t = this.pvFrom(n);
    if (!t || n.target.closest(".editor")) return;
    if (this.editor) {
      this.commitEditor();
      return;
    }
    const e = this.app.tool, r = this.v.toPage(t, n), o = performance.now(), a = this.lastDown;
    if (this.lastDown = { t: o, x: n.clientX, y: n.clientY, page: t.index }, e === "select" && a && a.page === t.index && o - a.t < 450 && Math.hypot(n.clientX - a.x, n.clientY - a.y) < 6) {
      this.lastDown = null, this.dbl(n);
      return;
    }
    switch (e) {
      case "select":
        return this.selectDown(n, t);
      case "arrange":
        return this.arrange?.down(n, t);
      case "edittext":
        return this.editTextDown(n, t);
      case "addtext":
        return this.addTextDown(n, t);
      case "highlight":
      case "underline":
      case "strike":
        return this.markupDown(n, t, e);
      case "draw":
        return this.drawDown(n, t);
      case "rect":
      case "ellipse":
        return this.shapeDown(n, t, e);
      case "line":
        return this.lineDown(n, t);
      case "stamp":
        return this.stampDown(t, r);
      case "redact":
        return this.redactDown(n, t);
      case "form":
        return this.forms?.down(n, t, (s, i, l, h) => this.drag(s, i, l, h));
      case "link":
        return this.links?.down(n, t, (s, i, l, h) => this.drag(s, i, l, h));
      case "textbox":
        return this.textbox?.down(n, t, (s, i, l, h) => this.drag(s, i, l, h));
      case "note":
        return this.noteDown(t, r);
      case "sign":
        return this.signDown(t, r);
      case "image":
        return this.imageDown(n, t);
      case "crop":
        return this.crop?.down(n, t);
    }
  }
  drag(n, t, e, r) {
    n.preventDefault();
    const o = t.ov;
    o.setPointerCapture(n.pointerId);
    let a = null, s = 0;
    const i = (h) => {
      a = h, s || (s = requestAnimationFrame(() => {
        s = 0, a && e(this.v.toPage(t, a), a);
      }));
    }, l = (h) => {
      if (o.removeEventListener("pointermove", i), o.removeEventListener("pointerup", l), o.removeEventListener("pointercancel", l), cancelAnimationFrame(s), t.svg.replaceChildren(), h.type === "pointercancel") {
        this.refreshOverlays();
        return;
      }
      r(this.v.toPage(t, h), h);
    };
    o.addEventListener("pointermove", i), o.addEventListener("pointerup", l), o.addEventListener("pointercancel", l);
  }
  selectDown(n, t) {
    const e = n.target.closest(".abox");
    if (!e) {
      this.app.selectedAnnot && (this.app.selectedAnnot = null, this.refreshOverlays(), this.onSelect());
      return;
    }
    const r = +e.dataset.annot;
    this.app.selectedAnnot = { page: t.index, index: r }, this.refreshOverlays(), this.onSelect();
    const o = this.v.annotsOf(t).find((_) => _.index === r);
    if (!o || wr(o.subtype)) return;
    const a = this.v.toPage(t, n), s = t.ov.querySelector(`.abox[data-annot="${r}"]`), i = parseFloat(s.style.left), l = parseFloat(s.style.top);
    t.ov.getBoundingClientRect();
    const h = n.clientX, m = n.clientY;
    this.drag(n, t, (_, p) => {
      s.style.left = i + (p.clientX - h) + "px", s.style.top = l + (p.clientY - m) + "px";
    }, (_) => {
      Vn(_, a) < 1.5 || this.app.mutate("Move annotation", { pages: [t.index] }, () => {
        this.app.doc.moveAnnot(t.index, r, _.x - a.x, _.y - a.y);
      }).catch((p) => H(p.message, "err"));
    });
  }
  dbl(n) {
    const t = this.pvFrom(n);
    if (!t || this.app.tool !== "select") return;
    const e = n.target.closest(".abox"), r = this.v.toPage(t, n), o = e ? +e.dataset.annot : this.v.annotsOf(t).filter((s) => !wr(s.subtype) && r.x >= s.rect.l && r.x <= s.rect.r && r.y >= s.rect.b && r.y <= s.rect.t).sort((s, i) => (s.rect.r - s.rect.l) * (s.rect.t - s.rect.b) - (i.rect.r - i.rect.l) * (i.rect.t - i.rect.b))[0]?.index;
    if (o == null) return;
    const a = o;
    if (this.v.annotsOf(t).find((s) => s.index === a)?.subtype === Q.FREETEXT && this.textbox) {
      this.textbox.edit(t, a);
      return;
    }
    this.onNoteCreated(t.index, a);
  }
  markupDown(n, t, e) {
    const r = this.v.toPage(t, n);
    let o = [];
    const a = e === "highlight" ? this.app.settings.markupColor : this.app.settings.lineMarkupColor, s = e === "highlight" ? Q.HIGHLIGHT : e === "underline" ? Q.UNDERLINE : Q.STRIKEOUT, i = a;
    this.drag(n, t, (l) => {
      o = this.app.doc.selectionRects(t.index, r, l).rects, t.svg.replaceChildren(...(o.length ? o : [fn(r, l)]).map((h) => {
        const m = t.tf.box(h);
        return pt("rect", { x: m.x, y: m.y, width: m.w, height: m.h, fill: Mn(i), "fill-opacity": o.length ? 0.35 : 0.12, stroke: o.length ? "none" : Mn(i), "stroke-dasharray": "4 3" });
      }));
    }, (l) => {
      if (!o.length) if (e === "highlight" && Math.abs(l.x - r.x) > 4 && Math.abs(l.y - r.y) > 4) o = [fn(r, l)];
      else {
        Vn(l, r) > 3 && H("Drag across text to mark it up", "warn");
        return;
      }
      const h = a;
      this.app.mutate(e === "highlight" ? "Highlight" : e === "underline" ? "Underline" : "Strikeout", { pages: [t.index] }, () => this.app.doc.addMarkup(t.index, s, o, h, this.app.settings.author)).catch((m) => H(m.message, "err"));
    });
  }
  drawDown(n, t) {
    const e = [this.v.toPage(t, n)], { inkColor: r, inkWidth: o } = this.app.settings, a = pt("polyline", { fill: "none", stroke: Mn(r), "stroke-width": o * this.v.zoom, "stroke-linecap": "round", "stroke-linejoin": "round" });
    t.svg.replaceChildren(a), this.drag(n, t, (s) => {
      Vn(s, e[e.length - 1]) < 0.6 || (e.push(s), a.isConnected || t.svg.replaceChildren(a), a.setAttribute("points", e.map((i) => this.v.toDev(t, i.x, i.y).join(",")).join(" ")));
    }, () => {
      e.length < 2 || this.app.mutate("Draw", { pages: [t.index] }, () => this.app.doc.addInk(t.index, [mc(e, 0.35)], r, o, this.app.settings.author)).catch((s) => H(s.message, "err"));
    });
  }
  shapeDown(n, t, e) {
    const r = this.v.toPage(t, n), { shapeColor: o, shapeWidth: a, shapeFill: c, shapeOpacity: d = 1 } = this.app.settings;
    if (!o && !c) return H("Pick an outline or a fill colour first", "warn");
    this.drag(n, t, (s) => {
      const i = t.tf.box(fn(r, s)), l = { fill: c ? Mn(c) : "none", stroke: o ? Mn(o) : "none", "stroke-width": a * this.v.zoom, opacity: d };
      t.svg.replaceChildren(e === "rect" ? pt("rect", { x: i.x, y: i.y, width: i.w, height: i.h, ...l }) : pt("ellipse", { cx: i.x + i.w / 2, cy: i.y + i.h / 2, rx: i.w / 2, ry: i.h / 2, ...l }));
    }, (s) => {
      Math.abs(s.x - r.x) < 3 || Math.abs(s.y - r.y) < 3 || this.app.mutate(e === "rect" ? "Rectangle" : "Ellipse", { pages: [t.index] }, () => this.app.doc.addShape(t.index, e === "rect" ? Q.SQUARE : Q.CIRCLE, fn(r, s), o, a, this.app.settings.author, { fill: c, opacity: d })).catch((i) => H(i.message, "err"));
    });
  }
  async stampDown(n, t) {
    const e = await Yl(this.app, n, t);
    e != null && this.arrange && (this.arrange.sel = { page: n.index, key: "a" + e }, this.arrange.extra = [], this.app.setTool("arrange"));
  }
  redactDown(n, t) {
    const e = this.v.toPage(t, n), r = this.app.settings.redactMode === "area";
    let o = [];
    this.drag(n, t, (a) => {
      o = r ? [fn(e, a)] : this.app.doc.selectionRects(t.index, e, a).rects;
      const s = o.length ? o : [fn(e, a)];
      t.svg.replaceChildren(...s.map((i) => {
        const l = t.tf.box(i);
        return pt("rect", { x: l.x, y: l.y, width: l.w, height: l.h, fill: "rgba(214,40,40,.18)", stroke: "#d62828", "stroke-dasharray": "4 3" });
      }));
    }, (a) => {
      r && (o = [fn(e, a)]), o = o.filter((s) => s.r - s.l > 1 && s.t - s.b > 1), !(!o.length || r && Vn(e, a) < 4) && this.app.mutate("Mark for redaction", { pages: [t.index] }, () => this.app.doc.addRedactMark(t.index, o, this.app.settings.author)).catch((s) => H(s.message, "err"));
    });
  }
  lineDown(n, t) {
    const e = this.v.toPage(t, n), { lineColor: r, lineWidth: o, lineEnds: a } = this.app.settings, s = a === "double" ? ["OpenArrow", "OpenArrow"] : a === "arrow" ? ["None", "OpenArrow"] : ["None", "None"];
    let i = e;
    const l = (h, m) => {
      if (!m.shiftKey) return h;
      const _ = h.x - e.x, p = h.y - e.y, P = Math.hypot(_, p), D = Math.round(Math.atan2(p, _) / (Math.PI / 4)) * (Math.PI / 4);
      return { x: e.x + P * Math.cos(D), y: e.y + P * Math.sin(D) };
    };
    this.drag(n, t, (h, m) => {
      i = l(h, m);
      const [_, p] = t.tf.apply(e.x, e.y), [P, D] = t.tf.apply(i.x, i.y), x = this.v.zoom, A = Mn(r), w = o * x, k = [pt("line", { x1: _, y1: p, x2: P, y2: D, stroke: A, "stroke-width": w, "stroke-linecap": "round" })], G = (E, B, z, O) => {
        const W = Math.max(7, o * 4.5) * x, N = Math.atan2(B - O, E - z), V = 28 * Math.PI / 180;
        k.push(pt("path", { d: `M${E - W * Math.cos(N - V)},${B - W * Math.sin(N - V)} L${E},${B} L${E - W * Math.cos(N + V)},${B - W * Math.sin(N + V)}`, fill: "none", stroke: A, "stroke-width": w }));
      };
      s[1] !== "None" && G(P, D, _, p), s[0] !== "None" && G(_, p, P, D), t.svg.replaceChildren(...k);
    }, (h, m) => {
      i = l(h, m), !(Vn(e, i) < 3) && this.app.mutate(s[1] === "None" ? "Line" : "Arrow", { pages: [t.index] }, () => this.app.doc.addLine(t.index, e, i, r, o, s, this.app.settings.author)).catch((_) => H(_.message, "err"));
    });
  }
  async noteDown(n, t) {
    const e = this.app.doc.annots(n.index).length;
    await this.app.mutate("Add note", { pages: [n.index] }, () => this.app.doc.addNote(n.index, { x: t.x - 10, y: t.y + 10 }, "", this.app.settings.noteColor, this.app.settings.author));
    const r = this.app.doc.annots(n.index), o = r[r.length - 1];
    this.app.setTool("select"), o && r.length > e && (this.app.selectedAnnot = { page: n.index, index: o.index }, this.refreshOverlays(), this.onNoteCreated(n.index, o.index));
  }
  saved = [];
  activeSig = -1;
  get signature() {
    return this.saved[this.activeSig] || null;
  }
  onSignatures = () => {
  };
  loadSaved() {
    try {
      const n = JSON.parse(localStorage.getItem("margin.signatures") || "null"), t = localStorage.getItem("margin.signature");
      for (const e of n || (t ? [t] : [])) this.addSaved(e, false);
    } catch {
    }
  }
  persist() {
    try {
      localStorage.setItem("margin.signatures", JSON.stringify(this.saved.map((n) => n.url))), localStorage.removeItem("margin.signature");
    } catch {
    }
  }
  addSaved(n, t = true) {
    const e = { url: n, w: 1, h: 1 };
    this.saved.unshift(e), this.saved.length > 6 && (this.saved.length = 6), this.activeSig = 0;
    const r = new Image();
    r.onload = () => {
      const a = y("canvas", { width: r.width, height: r.height }).getContext("2d");
      a.drawImage(r, 0, 0), Object.assign(e, { rgba: a.getImageData(0, 0, r.width, r.height).data, w: r.width, h: r.height }), this.onSignatures();
    }, r.src = n, t && this.persist();
  }
  removeSaved(n) {
    this.saved.splice(n, 1), this.activeSig = this.saved.length ? Math.min(this.activeSig, this.saved.length - 1) : -1, this.persist(), this.onSignatures();
  }
  chooseSaved(n) {
    this.activeSig = n, this.onSignatures();
  }
  async chooseSignature() {
    if (!this.saved.length) return this.captureSignature();
    let n = this.activeSig;
    const t = y("div", { class: "sig-choices", role: "listbox", "aria-label": "Saved signatures" }), e = () => t.replaceChildren(...this.saved.map((o, a) => y("div", { class: "sig-choice" + (a === n ? " on" : ""), role: "option", "aria-selected": String(a === n), tabindex: "0", onclick: () => {
      n = a, e();
    }, ondblclick: () => document.querySelector(".modal .btn.primary")?.click() }, y("img", { src: o.url, alt: `Signature ${a + 1}` }), y("button", { class: "sig-del", type: "button", "aria-label": "Remove this signature", title: "Remove", text: "×", onclick: (s) => {
      s.stopPropagation(), this.removeSaved(a), n >= this.saved.length && (n = this.saved.length - 1), this.saved.length ? e() : document.querySelector('.modal .btn[data-id="new"]')?.click();
    } }))));
    e();
    const r = await nt({ title: "Choose a signature", body: y("div", { class: "stack" }, t, y("p", { class: "hint", text: "Pick one, then click the page where it should go. Signatures are saved in this browser only." })), actions: [{ id: "new", label: "Draw a new one" }, { id: "cancel", label: "Cancel" }, { id: "use", label: "Use selected", primary: true }], onOpen: (o) => o.querySelectorAll(".modal-actions .btn").forEach((a, s) => a.dataset.id = ["new", "cancel", "use"][s]) });
    return r === "new" ? this.captureSignature() : r === "use" && this.saved[n] ? (this.chooseSaved(n), true) : false;
  }
  async captureSignature() {
    const n = y("canvas", { class: "sigpad", width: 1040, height: 360, "aria-label": "Signature pad" }), t = n.getContext("2d");
    t.lineCap = "round", t.lineJoin = "round", t.strokeStyle = "#141a2e", t.lineWidth = 9;
    let e = false, r = false, o = null;
    const a = (m) => {
      const _ = n.getBoundingClientRect();
      return { x: (m.clientX - _.left) * (n.width / _.width), y: (m.clientY - _.top) * (n.height / _.height) };
    };
    n.addEventListener("pointerdown", (m) => {
      e = true, r = true, n.setPointerCapture(m.pointerId), o = a(m);
    }), n.addEventListener("pointermove", (m) => {
      if (!e || !o) return;
      const _ = a(m);
      t.beginPath(), t.moveTo(o.x, o.y), t.lineTo(_.x, _.y), t.stroke(), o = _;
    }), n.addEventListener("pointerup", () => {
      e = false, o = null;
    });
    const s = y("button", { class: "btn ghost small", type: "button", text: "Clear", onclick: () => {
      t.clearRect(0, 0, n.width, n.height), r = false;
    } }), i = y("div", { class: "sig-body" }, y("div", { class: "sigwrap" }, n, y("div", { class: "sigline" })), y("div", { class: "sig-row" }, y("span", { class: "hint", text: "Sign with a mouse, trackpad, or finger." }), s));
    if (await nt({ title: "Draw your signature", body: i, actions: [{ id: "cancel", label: "Cancel" }, { id: "use", label: "Use signature", primary: true }] }) !== "use") return false;
    if (!r) return H("Draw a signature first", "warn"), false;
    const h = fc(n);
    return h ? (this.addSaved(h.toDataURL("image/png")), await new Promise((m) => setTimeout(m, 60)), true) : false;
  }
  async signDown(n, t) {
    if (!this.signature && !await this.chooseSignature()) return;
    const e = this.signature;
    if (e.rgba || await new Promise((s) => setTimeout(s, 80)), !e.rgba) return H("The signature is still loading. Click again.", "warn");
    const r = 150, o = r * (e.h / e.w), a = { l: t.x - r / 2, r: t.x + r / 2, t: t.y + o / 2, b: t.y - o / 2 };
    await this.app.mutate("Place signature", { pages: [n.index] }, () => this.app.doc.addImageStamp(n.index, a, e.rgba, e.w, e.h, this.app.settings.author)).catch((s) => H(s.message, "err")), this.app.setTool("select");
  }
  async signField(n, t) {
    if ((this.saved.length > 1 || !this.signature) && !await this.chooseSignature()) return;
    const e = this.signature;
    if (e.rgba || await new Promise((p) => setTimeout(p, 120)), !e.rgba) return H("The signature is still loading. Click again.", "warn");
    const r = Math.min(4, (t.t - t.b) * 0.08), o = t.r - t.l - r * 2, a = t.t - t.b - r * 2, s = Math.min(o / e.w, a / e.h), i = e.w * s, l = e.h * s, h = (t.l + t.r) / 2, m = t.b + r + (a - l) * 0.35, _ = { l: h - i / 2, r: h + i / 2, b: m, t: m + l };
    await this.app.mutate("Sign field", { pages: [n.index] }, () => this.app.doc.addImageStamp(n.index, _, e.rgba, e.w, e.h, this.app.settings.author)).catch((p) => H(p.message, "err"));
  }
  async chooseImage() {
    const n = await gs();
    if (!n) return false;
    try {
      return this.setImage(await Eo(n, n.name)), true;
    } catch (t) {
      return H(t.message, "err"), false;
    }
  }
  setImage(n) {
    this.image && this.image !== n && (URL.revokeObjectURL(this.image.url), this.image.bitmap.close()), this.image = n, this.onImage();
  }
  scaleOf(n) {
    return n.ov.clientWidth / n.w || this.v.zoom;
  }
  imageDown(n, t) {
    if (!this.image) {
      n.preventDefault(), this.chooseImage();
      return;
    }
    const e = this.image, r = t.ov.getBoundingClientRect(), o = n.clientX - r.left, a = n.clientY - r.top;
    let s = { x: o, y: a };
    this.drag(n, t, (i, l) => {
      s = { x: l.clientX - r.left, y: l.clientY - r.top };
      const h = sa(e, o, a, s.x, s.y);
      t.svg.replaceChildren(pt("rect", { x: Math.min(o, s.x), y: Math.min(a, s.y), width: Math.abs(s.x - o), height: Math.abs(s.y - a), fill: "none", stroke: "var(--sel)", "stroke-dasharray": "4 3", opacity: 0.5 }), pt("image", { href: e.url, x: h.x, y: h.y, width: h.w, height: h.h, opacity: 0.75, preserveAspectRatio: "none" }));
    }, () => {
      const l = Math.abs(s.x - o) > 8 && Math.abs(s.y - a) > 8 ? sa(e, o, a, s.x, s.y) : aa(e, t, this.scaleOf(t), o, a);
      this.placeImage(t, e, l);
    });
  }
  async placeImage(n, t, e) {
    const r = this.scaleOf(n);
    try {
      const o = await Fs(t, e.w / r, e.h / r);
      let a = -1;
      await this.app.mutate("Insert image", { pages: [n.index] }, () => {
        a = this.app.doc.addImage(n.index, ps(n, e), o);
      }), this.arrange && a >= 0 && (this.arrange.sel = { page: n.index, key: "o" + a }, this.arrange.extra = [], this.app.setTool("arrange"));
    } catch (o) {
      H(o.message || "The image could not be placed", "err");
    }
  }
  async placeImageFile(n, t) {
    let e;
    try {
      e = await Eo(n, n.name || "Pasted image");
    } catch (s) {
      return H(s.message, "err");
    }
    let r = t?.pv, o, a;
    if (r && t) {
      const s = r.ov.getBoundingClientRect();
      o = t.clientX - s.left, a = t.clientY - s.top;
    } else {
      if (r = this.v.views[this.app.currentPage] || this.v.views[0], !r) return;
      const s = r.ov.getBoundingClientRect(), i = this.v.el.getBoundingClientRect(), l = Math.max(s.top, i.top), h = Math.min(s.bottom, i.bottom);
      o = s.width / 2, a = (h > l ? (l + h) / 2 : s.top + s.height / 2) - s.top;
    }
    await this.placeImage(r, e, aa(e, r, this.scaleOf(r), o, a)), URL.revokeObjectURL(e.url), e.bitmap.close();
  }
  editTextDown(n, t) {
    const e = n.target.closest(".tbox");
    if (!e) return;
    n.preventDefault();
    const r = +e.dataset.obj, o = Pn(this.v.textsOf(t)), a = o.find((w) => w.objs[0].index === r);
    if (!a) return;
    if (a.block) {
      const w = To(a);
      this.openEditor(t, { kind: "block", blockId: a.objs[0].margin.id, rd: w, scale: sr(w.bm) }, a.bounds);
      return;
    }
    const s = _c(o, a), i = s[0].objs[0], l = i.fontName.replace(/^[A-Z]{6}\+/, ""), h = /bold|black|heavy|semibold|demi/i.test(l), m = /italic|oblique/i.test(l) || Math.abs(i.matrix[2]) > 0.05 * Math.abs(i.matrix[3]), _ = pc(s.map((w) => w.text)), p = sr(i.matrix), P = Rr(i.matrix), D = Math.min(...s.map((w) => w.bounds.l)), x = s.length > 1, A = { v: 1, paras: [[{ t: _, ...h ? { b: h } : {}, ...m ? { i: m } : {} }]], font: rs(i.fontName, _), size: i.fontSize, color: On(i.color), align: "left", lh: x ? Math.max(1, (s[0].objs[0].matrix[5] - s[1].objs[0].matrix[5]) / (i.fontSize * p)) : 1.5, width: x ? (Math.max(...s.map((w) => w.bounds.r)) - D) / p * 1.02 : void 0, bm: x ? [P[0], P[1], P[2], P[3], D, P[5]] : P };
    this.openEditor(t, { kind: x ? "para" : "object", objs: s.flatMap((w) => w.objs), rd: A, scale: p }, Jt(s.map((w) => w.bounds)));
  }
  addTextDown(n, t) {
    const e = this.v.toPage(t, n);
    let r = e;
    this.drag(n, t, (o) => {
      r = o;
      const a = t.tf.box({ l: Math.min(e.x, o.x), r: Math.max(e.x, o.x), t: e.y, b: e.y - this.app.settings.textSize * 1.4 });
      t.svg.replaceChildren(pt("rect", { x: a.x, y: a.y, width: a.w, height: a.h, fill: "none", stroke: "var(--accent)", "stroke-dasharray": "4 3" }));
    }, () => {
      const o = { x: Math.min(e.x, r.x), y: e.y }, a = Math.abs(r.x - e.x) > 24;
      this.openNewEditor(t, o, a ? Math.abs(r.x - e.x) : void 0);
    });
  }
  openNewEditor(n, t, e) {
    const r = this.app.settings, o = Gr(r.textStyle), s = { v: 1, paras: [[{ t: "", ...o.bold ? { b: true } : {}, ...o.italic ? { i: true } : {}, ...o.underline ? { u: true } : {}, ...o.strike ? { s: true } : {} }]], font: r.textFont, size: r.textSize, color: On(r.textColor), align: r.textAlign, lh: r.textLh, width: e, bm: [1, 0, 0, 1, t.x, t.y] };
    this.openEditor(n, { kind: "new", at: t, rd: s, scale: 1 }, null);
  }
  openEditor(n, t, e) {
    const r = t.rd, o = y("div", { class: "editor rich", contenteditable: "true", spellcheck: "true", role: "textbox", "aria-multiline": "true", "aria-label": "Text" });
    o.innerHTML = lc(r, (i) => i * t.scale * this.v.zoom, (i) => Dr(ze(i))), n.ov.append(o);
    const a = r.paras[0]?.[0] || {};
    this.editor = { pv: n, el: o, ...t, fontKey: r.font, size: r.size, color: bs(r.color), align: r.align, lh: r.lh, style: { bold: !!a.b, italic: !!a.i, underline: !!a.u, strike: !!a.s }, bounds: e };
    try {
      document.execCommand("styleWithCSS", false, "false"), document.execCommand("defaultParagraphSeparator", false, "div");
    } catch {
    }
    this.styleEditor(), o.addEventListener("input", () => this.placeEditor()), o.addEventListener("paste", (i) => {
      i.preventDefault();
      const l = i.clipboardData?.getData("text/plain") || "";
      document.execCommand("insertText", false, l.replace(/\r/g, ""));
    }), o.addEventListener("keydown", (i) => {
      i.stopPropagation(), i.key === "Escape" ? (i.preventDefault(), this.cancelEditor()) : (i.metaKey || i.ctrlKey) && !i.altKey && ["b", "i", "u"].includes(i.key.toLowerCase()) && !i.shiftKey ? (i.preventDefault(), this.onFormatKey(i.key.toLowerCase())) : (i.metaKey || i.ctrlKey) && i.shiftKey && i.key.toLowerCase() === "x" ? (i.preventDefault(), this.onFormatKey("x")) : i.key === "Enter" && (i.metaKey || i.ctrlKey || t.kind === "object" && !i.shiftKey) && (i.preventDefault(), this.commitEditor());
    }), o.addEventListener("pointerdown", (i) => i.stopPropagation());
    const s = () => {
      const i = this.editor;
      if (!i || i.el !== o) {
        document.removeEventListener("selectionchange", s);
        return;
      }
      if (!o.contains(document.getSelection()?.anchorNode || null)) return;
      const l = document.getSelection();
      l.rangeCount && (i.range = l.getRangeAt(0).cloneRange());
      const h = (A) => {
        try {
          return document.queryCommandState(A);
        } catch {
          return false;
        }
      }, m = { bold: h("bold"), italic: h("italic"), underline: h("underline"), strike: h("strikeThrough") }, _ = this.listState(), p = document.getSelection()?.anchorNode, P = (p instanceof HTMLElement ? p : p?.parentElement) || null;
      let D = P?.closest("[data-f]")?.dataset.f, x = +(P?.closest("[data-z]")?.dataset.z || 0) || void 0;
      if ((!D || !x) && l.rangeCount && !l.isCollapsed) {
        const A = l.getRangeAt(0).cloneContents(), w = (k) => {
          const G = [...A.querySelectorAll(`[data-${k}]`)].map((E) => E.dataset[k]);
          return G.length && G.every((E) => E === G[0]) ? G[0] : void 0;
        };
        D ||= w("f"), x ||= +(w("z") || 0) || void 0;
      }
      (Mr(m) !== Mr(i.style) || _ !== i.list || D !== i.selFont || x !== i.selSize) && (i.style = m, i.list = _, i.selFont = D, i.selSize = x, this.onEditor(i));
    };
    document.addEventListener("selectionchange", s), this.onEditor(this.editor), requestAnimationFrame(() => {
      o.focus();
      const i = document.createRange();
      i.selectNodeContents(o), i.collapse(false);
      const l = document.getSelection();
      l?.removeAllRanges(), l?.addRange(i), this.placeEditor();
    }), an(on(ze(r.font), {})).then(() => this.placeEditor()).catch(() => {
    });
  }
  toggleList(n) {
    const t = this.editor;
    t && (t.el.focus(), document.execCommand(n === "b" ? "insertUnorderedList" : "insertOrderedList"), this.onEditor(t));
  }
  listState() {
    const n = (t) => {
      try {
        return document.queryCommandState(t);
      } catch {
        return false;
      }
    };
    return n("insertUnorderedList") ? "b" : n("insertOrderedList") ? "n" : null;
  }
  setEditorStyle(n) {
    const t = this.editor;
    if (!t) return;
    if (t.el.focus(), t.range && t.el.contains(t.range.startContainer)) {
      const o = document.getSelection();
      o?.removeAllRanges(), o?.addRange(t.range);
    }
    const e = document.getSelection(), r = !!e && !e.isCollapsed && t.el.contains(e.anchorNode);
    if (n.style) {
      const o = { bold: "bold", italic: "italic", underline: "underline", strike: "strikeThrough" };
      for (const a of Object.keys(o)) n.style[a] !== void 0 && !!n.style[a] != !!t.style[a] && document.execCommand(o[a]);
      t.style = { ...t.style, ...n.style };
    }
    n.color && (r ? document.execCommand("foreColor", false, "#" + On(n.color)) : t.color = n.color), n.fontKey && (r && ha(t.el, "f", n.fontKey, Dr(ze(n.fontKey))) ? (t.selFont = n.fontKey, an(on(ze(n.fontKey), {})).catch(() => {
    }), delete n.fontKey) : t.fontKey = n.fontKey), n.size && (r && ha(t.el, "z", String(n.size), n.size * t.scale * this.v.zoom + "px") ? (t.selSize = n.size, delete n.size) : t.size = n.size);
    {
      const o = document.getSelection();
      o?.rangeCount && t.el.contains(o.anchorNode) && (t.range = o.getRangeAt(0).cloneRange());
    }
    n.align && (t.align = n.align), n.lh && (t.lh = n.lh), this.styleEditor(), n.fontKey && an(on(ze(t.fontKey), {})).then(() => this.placeEditor()).catch((o) => H(o.message, "err")), this.onEditor(t);
  }
  styleEditor() {
    const n = this.editor;
    if (!n) return;
    const t = ze(n.fontKey), e = this.v.zoom, r = n.size * n.scale * e;
    Object.assign(n.el.style, { fontFamily: Dr(t), fontSize: r + "px", color: Mn(n.color), lineHeight: String(n.lh), textAlign: n.align, whiteSpace: n.rd.width ? "pre-wrap" : "pre", width: n.rd.width ? n.rd.width * n.scale * e + "px" : "auto" }), this.placeEditor();
  }
  placeEditor() {
    const n = this.editor;
    if (!n) return;
    const t = this.v.zoom, e = n.size * n.scale * t, r = n.lh * e;
    let o, a;
    if (n.kind === "new") {
      const [i, l] = this.v.toDev(n.pv, n.at.x, n.at.y);
      o = i, a = l + 0.8 * e;
    } else [o, a] = this.v.toDev(n.pv, n.rd.bm[4], n.rd.bm[5]);
    const s = a - ((r - 1.2 * e) / 2 + 0.92 * e) - 3;
    n.el.style.left = o - 4 + "px", n.el.style.top = s + "px", n.rd.width || (n.el.style.width = "auto", n.el.style.minWidth = Math.max(40, (n.bounds ? this.v.zoom * (n.bounds.r - n.bounds.l) : 0) + 8) + "px");
  }
  cancelEditor() {
    const n = this.editor;
    n && (this.editor = null, n.el.remove(), this.onEditor(null), this.overlay(n.pv));
  }
  editorDoc(n) {
    const t = uc(n.el, On(n.color), n.fontKey, n.size), e = t.paras.map(Go), r = t.lists.some(Boolean) ? t.lists : void 0, o = { ...n.rd, paras: e, font: n.fontKey, size: n.size, color: On(n.color), align: n.align, lh: n.lh };
    return r ? o.lists = r : delete o.lists, o;
  }
  async commitEditor() {
    const n = this.editor;
    if (!n) return;
    const t = this.editorDoc(n);
    this.editor = null, n.el.remove(), this.onEditor(null);
    const e = this.app.doc, r = n.pv.index, o = ur(t), a = gc(t, n.rd);
    try {
      if (n.kind === "new") {
        if (!o.trim()) return this.overlay(n.pv);
        const s = await this.newBlockMatrix(n), i = Ds(t).key !== t.font;
        await this.app.mutate("Add text", { pages: [r] }, async () => {
          await tr(e, r, { ...t, bm: s });
        }), i && H(`${ze(t.font).label} can't show these characters, so Margin used Sarabun.`, "warn", 4200);
      } else if (n.kind === "block") {
        if (a) return this.overlay(n.pv);
        await this.app.mutate("Edit text", { pages: [r] }, async () => {
          gt(e, r, n.blockId), o.trim() && await tr(e, r, t);
        });
      } else {
        if (a) return this.overlay(n.pv);
        const s = n.objs, i = s[0], l = s.map((m) => m.index), h = t.paras.length === 1 && t.paras[0].length === 1 && Fc(t.paras[0][0], n.rd.paras[0][0]) && t.font === n.rd.font && t.size === n.rd.size && t.color === n.rd.color;
        await this.app.mutate("Edit text", { pages: [r] }, async () => {
          if (!o.trim()) return Fn(e, r, l);
          n.kind === "object" && h && s.length === 1 && !ar(o) && ts(e, r, i.index, o) || (Fn(e, r, l), await tr(e, r, t));
        });
      }
    } catch (s) {
      H(s.message || "Edit failed", "err"), this.overlay(n.pv);
    }
  }
  async newBlockMatrix(n) {
    const t = n.pv, e = t.inv, [r, o] = e.apply(0, 0), [a, s] = e.apply(1, 0), [i, l] = e.apply(0, 1);
    let h = a - r, m = s - o;
    const _ = Math.hypot(h, m);
    h /= _, m /= _;
    let p = -(i - r), P = -(l - o);
    const D = Math.hypot(p, P);
    p /= D, P /= D;
    const A = ((await $t(ze(n.fontKey)).catch(() => null))?.ascent ?? 0.8) * n.size, w = n.at;
    return [h, m, p, P, w.x - p * A, w.y - P * A];
  }
}
function Pn(u) {
  const n = [], t = /* @__PURE__ */ new Map(), e = [];
  for (const l of u) if (l.margin?.id) {
    const h = t.get(l.margin.id) || [];
    h.push(l), t.set(l.margin.id, h);
  } else e.push(l);
  for (const l of t.values()) {
    l.sort((_, p) => _.margin.ln - p.margin.ln);
    const h = l.find((_) => _.margin.rt)?.margin.rt, m = h ? Mo(h) : null;
    n.push({ objs: l, bounds: Jt(l.map((_) => _.bounds)), block: true, text: m ? ur(m) : l.map((_) => _.text).join(`
`) });
  }
  const r = (l) => l.fontSize * sr(l.matrix), o = (l) => Math.abs(l.matrix[1]) < 1e-3 && Math.abs(l.matrix[2]) < 1e-3 && l.matrix[0] > 0 && l.matrix[3] > 0, a = e.filter((l) => !o(l));
  for (const l of a) n.push({ objs: [l], bounds: l.bounds, block: false, text: l.text });
  const s = e.filter(o).sort((l, h) => h.matrix[5] - l.matrix[5] || l.matrix[4] - h.matrix[4]), i = [];
  for (const l of s) {
    const h = i.find((m) => Math.abs(m[0].matrix[5] - l.matrix[5]) < r(m[0]) * 0.2 && Math.abs(r(m[0]) - r(l)) < r(m[0]) * 0.15);
    h ? h.push(l) : i.push([l]);
  }
  for (const l of i) {
    l.sort((_, p) => _.bounds.l - p.bounds.l);
    let h = [];
    const m = () => {
      if (h.length) {
        if (!da(h).trim()) {
          h = [];
          return;
        }
        n.push({ objs: h, bounds: Jt(h.map((_) => _.bounds)), block: false, text: da(h) }), h = [];
      }
    };
    for (const _ of l) {
      const p = h[h.length - 1];
      p && (_.bounds.l - p.bounds.r > r(p) * 1.6 || _.color.slice(0, 3).join() !== p.color.slice(0, 3).join() || _.fontName !== p.fontName) && m(), h.push(_);
    }
    m();
  }
  return n;
}
function da(u) {
  let n = "", t = null;
  for (const e of u) if (e.text) {
    if (t) {
      if (e.bounds.l >= t.bounds.l - 0.6 && e.bounds.r <= t.bounds.r + 0.6 && e.text.trim() === t.text.trim()) {
        /\s$/.test(e.text) && !/\s$/.test(n) && (n += " ");
        continue;
      }
      const o = e.bounds.l - t.bounds.r, a = e.fontSize * sr(e.matrix);
      o > a * 0.22 && !/\s$/.test(n) && !/^\s/.test(e.text) && (n += " ");
    }
    n += /\s$/.test(n) ? e.text.replace(/^\s+/, "") : e.text, t = e;
  }
  return n.replace(/\s+$/, "");
}
const sr = (u) => Math.hypot(u[0], u[1]) || 1;
function Rr(u) {
  const [n, t, e, r, o, a] = u, s = n * n + t * t || 1, i = (n * e + t * r) / s;
  return [n, t, e - i * n, r - i * t, o, a];
}
const fn = (u, n) => ({ l: Math.min(u.x, n.x), r: Math.max(u.x, n.x), b: Math.min(u.y, n.y), t: Math.max(u.y, n.y) });
function mc(u, n) {
  if (u.length < 3) return u;
  const t = new Uint8Array(u.length);
  t[0] = t[u.length - 1] = 1;
  const e = [[0, u.length - 1]];
  for (; e.length; ) {
    const [r, o] = e.pop();
    let a = 0, s = -1;
    for (let i = r + 1; i < o; i++) {
      const l = u[r], h = u[o], m = u[i], _ = h.x - l.x, p = h.y - l.y, P = Math.hypot(_, p) || 1, D = Math.abs(p * m.x - _ * m.y + h.x * l.y - h.y * l.x) / P;
      D > a && (a = D, s = i);
    }
    a > n && s > 0 && (t[s] = 1, e.push([r, s], [s, o]));
  }
  return u.filter((r, o) => t[o]);
}
function fc(u) {
  const n = u.getContext("2d"), { data: t, width: e, height: r } = n.getImageData(0, 0, u.width, u.height);
  let o = e, a = 0, s = r, i = 0;
  for (let m = 0; m < r; m++) for (let _ = 0; _ < e; _++) t[(m * e + _) * 4 + 3] > 8 && (_ < o && (o = _), _ > a && (a = _), m < s && (s = m), m > i && (i = m));
  if (a <= o || i <= s) return null;
  const l = 6;
  o = Math.max(0, o - l), s = Math.max(0, s - l), a = Math.min(e - 1, a + l), i = Math.min(r - 1, i + l);
  const h = y("canvas", { width: a - o + 1, height: i - s + 1 });
  return h.getContext("2d").drawImage(u, o, s, a - o + 1, i - s + 1, 0, 0, a - o + 1, i - s + 1), h;
}
const Jr = { select: { label: "Select", key: "V", icon: "select", hint: "Select, move or delete annotations. Fill form fields." }, arrange: { label: "Move & resize", key: "A", icon: "arrange", hint: "Click text, an image or an annotation. Drag to move, drag a corner to resize. Alt turns off snapping." }, edittext: { label: "Edit text", key: "E", icon: "edittext", hint: "Click any text on the page to edit it." }, addtext: { label: "Add text", key: "T", icon: "addtext", hint: "Click where the new text should start." }, highlight: { label: "Highlight", key: "H", icon: "highlight", hint: "Drag across text to highlight it." }, underline: { label: "Underline", key: "U", icon: "underline", hint: "Drag across text to underline it." }, strike: { label: "Strikeout", key: "K", icon: "strike", hint: "Drag across text to strike it out." }, draw: { label: "Draw", key: "D", icon: "draw", hint: "Draw freehand on the page." }, rect: { label: "Rectangle", key: "R", icon: "rect", hint: "Drag to draw a rectangle." }, form: { label: "Form field", key: "F", icon: "formfield", hint: "Pick a field type, then drag a box (or click). Click a field to rename it, change its options or delete it." }, redact: { label: "Redact", key: "X", icon: "redact", hint: "Sweep across text or drag over an area to mark it. Nothing is removed until you apply." }, link: { label: "Link", key: "G", icon: "link", hint: "Sweep across text or drag a box to add a link. Click a link to edit or remove it." }, stamp: { label: "Stamp", key: "P", icon: "stamp", hint: "Pick a stamp, then click the page." }, textbox: { label: "Text box & callout", key: "B", icon: "textbox", hint: "Drag a box, or click, then type. Double-click a text box with Select to edit it." }, line: { label: "Line & arrow", key: "L", icon: "line", hint: "Drag to draw. Shift keeps it to 45° steps." }, ellipse: { label: "Ellipse", key: "O", icon: "ellipse", hint: "Drag to draw an ellipse." }, note: { label: "Note", key: "N", icon: "note", hint: "Click to pin a sticky note." }, sign: { label: "Signature", key: "S", icon: "sign", hint: "Click the page where the signature should go." }, crop: { label: "Crop pages", key: "C", icon: "crop", hint: "Drag a rectangle around the part of the page to keep." }, image: { label: "Image", key: "I", icon: "image", hint: "Click to place at natural size, or drag a box to size it. You can also paste or drop an image." } };
async function ws(u, n, t, e) {
  if (t.block) {
    const h = t.objs[0], m = h.margin;
    if (gt(u, n, m.id), !e.trim()) return;
    const _ = m.bm || Rr(h.matrix), p = m.color ? hc(m.color) : h.color;
    await Tr(u, n, { lines: e.split(`
`), fontKey: m.font || "sarabun", size: m.size || h.fontSize, color: p, matrix: _, ...Gr(m.st), align: m.al || "left", lineHeight: m.lh || 1.5 });
    return;
  }
  const r = t.objs, o = r[0], a = r.map((h) => h.index), s = e.replace(/\n+/g, " ");
  if (!s.trim()) return Fn(u, n, a);
  if (r.length === 1 && !ar(s) && ts(u, n, o.index, s)) return;
  const i = o.fontName.replace(/^[A-Z]{6}\+/, ""), l = { bold: /bold|black|heavy|semibold|demi/i.test(i), italic: /italic|oblique/i.test(i) || Math.abs(o.matrix[2]) > 0.05 * Math.abs(o.matrix[3]) };
  Fn(u, n, a), await Tr(u, n, { lines: [s], fontKey: rs(o.fontName, s), size: o.fontSize, color: o.color, matrix: Rr(o.matrix), ...l });
}
function To(u) {
  const n = u.objs.find((i) => i.margin?.rt), t = n ? Mo(n.margin.rt) : null;
  if (t) return t;
  const e = u.objs[0], r = e.margin, o = /* @__PURE__ */ new Map();
  for (const i of u.objs) o.set(i.margin.ln, (o.get(i.margin.ln) || "") + i.text);
  const a = Math.max(...o.keys()) + 1, s = [];
  for (let i = 0; i < a; i++) s.push(o.get(i) || "");
  return oc(s, { font: r.font || "sarabun", size: r.size || e.fontSize, color: r.color || On(e.color), st: r.st || "", align: r.al || "left", lh: r.lh || 1.5, bm: r.bm || Rr(e.matrix) });
}
function _c(u, n) {
  const t = (i) => {
    const l = i.objs[0];
    return { font: l.fontName, size: l.fontSize * sr(l.matrix), color: l.color.slice(0, 3).join(), left: i.bounds.l, base: l.matrix[5] };
  }, e = t(n), r = (i) => i.objs.every((l) => Math.abs(l.matrix[1]) < 1e-3 && Math.abs(l.matrix[2]) < 1e-3 && l.matrix[0] > 0 && l.matrix[3] > 0);
  if (!r(n)) return [n];
  const o = u.filter((i) => {
    if (i.block || !r(i)) return false;
    const l = t(i);
    return l.font === e.font && Math.abs(l.size - e.size) < e.size * 0.05 && l.color === e.color && Math.abs(l.left - e.left) < Math.max(2, e.size * 0.3);
  }).sort((i, l) => t(l).base - t(i).base), a = (i) => i.bounds.r - i.bounds.l, s = [];
  for (const i of o) {
    const l = s[s.length - 1], h = l?.[l.length - 1];
    let m = !!h;
    if (h) {
      const _ = t(h).base - t(i).base;
      if (_ < e.size * 0.9 || _ > e.size * 2.2) m = false;
      else if (l.length > 1) {
        const p = t(l[l.length - 2]).base - t(h).base;
        Math.abs(p - _) > e.size * 0.25 && (m = false);
      }
      m && a(h) < Math.max(...l.map(a)) * 0.8 && l.length > 1 && (m = false), m && l.length === 1 && a(h) < a(i) * 0.6 && (m = false);
    }
    m ? l.push(i) : s.push([i]);
  }
  return s.find((i) => i.includes(n)) || [n];
}
function pc(u) {
  let n = "";
  for (const t of u.map((e) => e.trim())) {
    if (!n) {
      n = t;
      continue;
    }
    const e = n[n.length - 1], r = t[0];
    if (e === "-" && /[a-z]/i.test(r)) {
      n = n.slice(0, -1) + t;
      continue;
    }
    n += /[\u0E00-\u0E7F]/.test(e) && /[\u0E00-\u0E7F]/.test(r) ? t : " " + t;
  }
  return n;
}
const Fc = (u, n) => !!u?.b == !!n?.b && !!u?.i == !!n?.i && !!u?.u == !!n?.u && !!u?.s == !!n?.s && (u?.c || "") === (n?.c || "");
function gc(u, n) {
  const t = (e) => JSON.stringify({ p: e.paras.map((r) => Go(r).map((o) => ({ ...o }))), f: e.font, s: e.size, c: e.color, a: e.align, l: e.lh, w: e.width || 0, li: (e.lists || []).map((r) => r || "").join(",").replace(/,+$/, "") });
  return t(u) === t(n);
}
const ma = ["nw", "n", "ne", "e", "se", "s", "sw", "w"], fa = 5;
class bc {
  app;
  v;
  sel = null;
  extra = [];
  items = /* @__PURE__ */ new Map();
  onChange = () => {
  };
  onFreeText = () => {
  };
  constructor(n, t) {
    this.app = n, this.v = t;
  }
  itemsOf(n) {
    let t = this.items.get(n.index);
    if (t) return t;
    const e = this.app.doc;
    t = [];
    for (const l of this.v.annotsOf(n)) if (!(wr(l.subtype) || l.subtype === Q.POPUP || l.subtype === Q.REDACT)) {
      if (l.subtype === Q.FREETEXT && l.ft) {
        t.push({ kind: "annot", key: "a" + l.index, label: l.ft.tip ? "Callout" : "Text box", bounds: l.ft.box, objs: [], annot: l.index, uniform: false, resizable: true, ft: l.ft });
        continue;
      }
      if (l.subtype === Q.LINE && l.line) {
        t.push({ kind: "annot", key: "a" + l.index, label: "Line", bounds: l.rect, objs: [], annot: l.index, uniform: false, resizable: false, line: l.line });
        continue;
      }
      t.push({ kind: "annot", key: "a" + l.index, label: l.subtype === Q.STAMP && l.contents === "Signature" ? "Signature" : Zn[l.subtype] || "Annotation", bounds: l.rect, objs: [], annot: l.index, uniform: l.subtype === Q.STAMP, resizable: l.subtype !== Q.TEXT });
    }
    for (const l of this.v.fieldsOf(n)) t.push({ kind: "annot", key: "a" + l.index, label: "Form field", bounds: l.rect, objs: [], annot: l.index, uniform: false, resizable: true });
    for (const l of e.links(n.index)) t.push({ kind: "annot", key: "a" + l.index, label: "Link", bounds: l.rect, objs: [], annot: l.index, uniform: false, resizable: true });
    const r = e.pageObjects(n.index), o = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
    for (const l of r) l.blockId ? ((o.get(l.blockId) || o.set(l.blockId, []).get(l.blockId)).push(l.bounds), (a.get(l.blockId) || a.set(l.blockId, []).get(l.blockId)).push(l.index)) : (l.type === 3 || l.type === 5) && t.push({ kind: "image", key: "o" + l.index, label: l.type === 3 ? "Image" : "Graphic", bounds: l.bounds, objs: [l.index], uniform: false, resizable: true });
    const s = /* @__PURE__ */ new Map();
    for (const l of this.v.textsOf(n)) if (l.margin?.rt) {
      const h = Mo(l.margin.rt);
      h?.width && s.set(l.margin.id, h);
    }
    for (const [l, h] of o) t.push({ wrap: s.get(l), kind: "block", key: "b" + l, label: l.startsWith("hf-") ? "Header / footer" : l === "wm" ? "Watermark" : l === "bg" ? "Background" : "Text", bounds: Jt(h), objs: a.get(l), block: l, uniform: true, resizable: true });
    for (const l of Pn(this.v.textsOf(n))) l.block || t.push({ kind: "line", key: "l" + l.objs[0].index, label: "Text", bounds: l.bounds, objs: l.objs.map((h) => h.index), uniform: true, resizable: true });
    const i = (l) => (l.r - l.l) * (l.t - l.b);
    return t.sort((l, h) => i(l.bounds) - i(h.bounds)), this.items.set(n.index, t), t;
  }
  invalidate(n) {
    n == null ? this.items.clear() : this.items.delete(n);
  }
  overlay(n) {
    if (this.items.delete(n.index), this.cropping) {
      this.cropOverlay(n);
      return;
    }
    const t = this.itemsOf(n);
    for (const o of [...t].reverse()) {
      const a = n.tf.box(o.bounds);
      n.ov.append(y("div", { class: "obox", "data-k": o.key, title: o.label, style: { left: a.x - 2 + "px", top: a.y - 2 + "px", width: a.w + 4 + "px", height: a.h + 4 + "px" } }));
    }
    const e = this.sel;
    if (!e || e.page !== n.index) return;
    this.extra = this.extra.filter((o) => o !== e.key && t.some((a) => a.key === o));
    const r = t.find((o) => o.key === e.key);
    if (!r) {
      const o = this.extra.shift();
      this.sel = o ? { page: e.page, key: o } : null, this.sel && this.overlay(n);
      return;
    }
    if (this.extra.length) {
      const o = this.selected(n);
      for (const s of o) {
        const i = n.tf.box(s.bounds);
        n.ov.append(y("div", { class: "oframe multi" + (s === r ? " primary" : ""), "data-k": s.key, style: { left: i.x - 2 + "px", top: i.y - 2 + "px", width: i.w + 4 + "px", height: i.h + 4 + "px" } }));
      }
      const a = this.groupBox(n, o);
      n.ov.append(y("div", { class: "ogroup", style: { left: a.x - 5 + "px", top: a.y - 5 + "px", width: a.w + 10 + "px", height: a.h + 10 + "px" } }, y("span", { class: "olabel", text: `${o.length} objects · ${this.size(n, a)}` })));
      return;
    }
    n.ov.append(this.frame(n, r, n.tf.box(r.bounds)));
  }
  selected(n) {
    const t = this.sel;
    if (!t) return [];
    if (n ??= this.v.views[t.page], !n || n.index !== t.page) return [];
    const e = this.itemsOf(n);
    return [t.key, ...this.extra].map((o) => e.find((a) => a.key === o)).filter((o) => !!o);
  }
  groupBox(n, t) {
    const e = t.map((i) => n.tf.box(i.bounds)), r = Math.min(...e.map((i) => i.x)), o = Math.min(...e.map((i) => i.y)), a = Math.max(...e.map((i) => i.x + i.w)), s = Math.max(...e.map((i) => i.y + i.h));
    return { x: r, y: o, w: a - r, h: s - o };
  }
  toggle(n, t) {
    const e = this.sel;
    if (!e || e.page !== n.index) this.sel = { page: n.index, key: t }, this.extra = [];
    else if (e.key === t) {
      const r = this.extra.shift();
      this.sel = r ? { page: n.index, key: r } : null;
    } else this.extra.includes(t) ? this.extra = this.extra.filter((r) => r !== t) : (this.extra.push(e.key), this.sel = { page: n.index, key: t });
    this.refresh(), this.onChange();
  }
  selectAll() {
    const n = this.v.views[this.sel?.page ?? this.app.currentPage];
    if (!n) return;
    const t = this.itemsOf(n).filter((e) => e.kind !== "block" || !/^(wm|bg|hf-)/.test(e.block || ""));
    t.length && (this.sel = { page: n.index, key: t[0].key }, this.extra = t.slice(1).map((e) => e.key), this.refresh(), this.onChange());
  }
  clear() {
    this.sel && (this.sel = null, this.extra = [], this.refresh(), this.onChange());
  }
  frame(n, t, e) {
    const r = y("div", { class: "oframe" + (t.resizable ? "" : " fixed"), "data-k": t.key, style: { left: e.x - 2 + "px", top: e.y - 2 + "px", width: e.w + 4 + "px", height: e.h + 4 + "px" } }, y("span", { class: "olabel", text: `${t.label} · ${this.size(n, e)}` }));
    if (t.resizable) for (const a of ma) t.uniform && a.length === 1 && !(t.wrap && (a === "e" || a === "w")) || r.append(y("span", { class: "ohandle " + a, "data-h": a }));
    return (t.line || (t.ft?.tip ? [t.ft.tip] : [])).forEach((a, s) => {
      const [i, l] = n.tf.apply(a.x, a.y);
      r.append(y("span", { class: "ohandle pt", "data-h": "p" + s, style: { left: i - e.x + 2 - 6 + "px", top: l - e.y + 2 - 6 + "px" } }));
    }), r;
  }
  size(n, t) {
    const e = this.v.zoom;
    return `${Math.round(t.w / e)} × ${Math.round(t.h / e)} pt`;
  }
  down(n, t) {
    const r = n.target.closest(".ohandle"), o = this.itemsOf(t);
    let a;
    if (r && this.sel?.page === t.index) a = o.find((l) => l.key === this.sel.key);
    else {
      const l = t.ov.getBoundingClientRect(), h = n.clientX - l.left, m = n.clientY - l.top;
      a = o.find((_) => _.line && Dc(h, m, t.tf.apply(_.line[0].x, _.line[0].y), t.tf.apply(_.line[1].x, _.line[1].y)) < 7) || o.find((_) => {
        if (_.line) return false;
        const p = t.tf.box(_.bounds);
        return h >= p.x - 3 && h <= p.x + p.w + 3 && m >= p.y - 3 && m <= p.y + p.h + 3;
      });
    }
    const s = n.shiftKey || n.ctrlKey || n.metaKey;
    if (!a) {
      n.preventDefault(), !s && this.sel && (this.sel = null, this.extra = [], this.refresh(), this.onChange()), this.marquee(n, t, s);
      return;
    }
    if (n.preventDefault(), s && !r) {
      this.toggle(t, a.key);
      return;
    }
    if (!r && this.extra.length && this.sel?.page === t.index && (this.sel.key === a.key || this.extra.includes(a.key))) {
      this.dragGroup(n, t);
      return;
    }
    (this.sel?.page !== t.index || this.sel.key !== a.key || this.extra.length) && (this.sel = { page: t.index, key: a.key }, this.extra = [], this.refresh(), this.onChange());
    const i = t.ov.querySelector(".oframe");
    if (i) {
      if ((a.line || a.ft?.tip) && r && /^p[01]$/.test(r.dataset.h)) return this.dragEnd(n, t, a, +r.dataset.h[1]);
      this.drag(n, t, a, i, r?.dataset.h || null);
    }
  }
  drag(n, t, e, r, o) {
    const a = t.ov;
    a.setPointerCapture(n.pointerId);
    const s = t.tf.box(e.bounds), i = n.clientX, l = n.clientY, h = t.w * this.v.zoom, m = t.h * this.v.zoom, _ = this.itemsOf(t).filter((E) => E !== e).map((E) => t.tf.box(E.bounds)), p = [0, h / 2, h, ..._.flatMap((E) => [E.x, E.x + E.w / 2, E.x + E.w])], P = [0, m / 2, m, ..._.flatMap((E) => [E.y, E.y + E.h / 2, E.y + E.h])];
    let D = { ...s }, x = false;
    const A = y("div", { class: "oguides" });
    a.append(A);
    const w = r.querySelector(".olabel"), k = (E) => {
      const B = E.clientX - i, z = E.clientY - l;
      if (!(!x && Math.hypot(B, z) < 2)) {
        if (x = true, A.replaceChildren(), o) {
          let { x: O, y: W, w: N, h: V } = s;
          if (o.includes("e") && (N = Math.max(6, s.w + B)), o.includes("w") && (N = Math.max(6, s.w - B), O = s.x + s.w - N), o.includes("s") && (V = Math.max(6, s.h + z)), o.includes("n") && (V = Math.max(6, s.h - z), W = s.y + s.h - V), e.wrap && o.length === 1) V = s.h, W = s.y;
          else if ((e.uniform || o.length === 2) && !(E.shiftKey && !e.uniform) && o.length === 2) {
            const q = Math.max(N / s.w, V / s.h);
            N = s.w * q, V = s.h * q, o.includes("w") && (O = s.x + s.w - N), o.includes("n") && (W = s.y + s.h - V);
          }
          D = { x: O, y: W, w: N, h: V };
        } else if (D = { ...s, x: s.x + B, y: s.y + z }, !E.altKey) {
          const O = (W, N, V, q) => {
            let Y = fa + 1, ne = W, J = -1;
            for (const [ee] of [[0], [N / 2], [N]]) for (const ae of V) {
              const de = Math.abs(W + ee - ae);
              de < Y && (Y = de, ne = ae - ee, J = ae);
            }
            return J >= 0 && A.append(y("div", { class: "oguide " + (q ? "v" : "h"), style: q ? { left: J + "px" } : { top: J + "px" } })), ne;
          };
          D.x = O(D.x, D.w, p, true), D.y = O(D.y, D.h, P, false);
        }
        Object.assign(r.style, { left: D.x - 2 + "px", top: D.y - 2 + "px", width: D.w + 4 + "px", height: D.h + 4 + "px" }), w && (w.textContent = `${e.label} · ${this.size(t, D)}`);
      }
    }, G = () => {
      a.removeEventListener("pointermove", k), a.removeEventListener("pointerup", G), a.removeEventListener("pointercancel", G), A.remove(), x && this.apply(t, e, s, D);
    };
    a.addEventListener("pointermove", k), a.addEventListener("pointerup", G), a.addEventListener("pointercancel", G);
  }
  marquee(n, t, e) {
    const r = t.ov;
    r.setPointerCapture(n.pointerId);
    const o = r.getBoundingClientRect(), a = n.clientX - o.left, s = n.clientY - o.top;
    let i = null;
    const l = (m) => {
      const _ = m.clientX - o.left, p = m.clientY - o.top;
      if (i = { x: Math.min(a, _), y: Math.min(s, p), w: Math.abs(_ - a), h: Math.abs(p - s) }, i.w < 3 && i.h < 3) return;
      const P = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      for (const [D, x] of Object.entries({ x: i.x, y: i.y, width: i.w, height: i.h })) P.setAttribute(D, String(x));
      P.setAttribute("class", "omarquee"), t.svg.replaceChildren(P);
    }, h = () => {
      if (r.removeEventListener("pointermove", l), r.removeEventListener("pointerup", h), r.removeEventListener("pointercancel", h), t.svg.replaceChildren(), !i || i.w < 3 && i.h < 3) return;
      const m = i, _ = this.itemsOf(t).filter((D) => {
        const x = t.tf.box(D.bounds), A = x.x + x.w / 2, w = x.y + x.h / 2;
        return A >= m.x && A <= m.x + m.w && w >= m.y && w <= m.y + m.h;
      }).filter((D) => D.kind !== "block" || !/^(wm|bg|hf-)/.test(D.block || ""));
      if (!_.length) return;
      const p = new Set(e && this.sel?.page === t.index ? [this.sel.key, ...this.extra] : []);
      for (const D of _) p.add(D.key);
      const P = [...p];
      this.sel = { page: t.index, key: P[0] }, this.extra = P.slice(1), this.refresh(), this.onChange();
    };
    r.addEventListener("pointermove", l), r.addEventListener("pointerup", h), r.addEventListener("pointercancel", h);
  }
  dragGroup(n, t) {
    const e = t.ov;
    e.setPointerCapture(n.pointerId);
    const r = this.selected(t), o = this.groupBox(t, r), a = n.clientX, s = n.clientY, i = t.w * this.v.zoom, l = t.h * this.v.zoom, h = this.itemsOf(t).filter((G) => !r.includes(G)).map((G) => t.tf.box(G.bounds)), m = [0, i / 2, i, ...h.flatMap((G) => [G.x, G.x + G.w / 2, G.x + G.w])], _ = [0, l / 2, l, ...h.flatMap((G) => [G.y, G.y + G.h / 2, G.y + G.h])], p = y("div", { class: "oguides" });
    e.append(p);
    const P = [...e.querySelectorAll(".oframe.multi, .ogroup")];
    let D = 0, x = 0, A = false;
    const w = (G) => {
      if (D = G.clientX - a, x = G.clientY - s, !(!A && Math.hypot(D, x) < 2)) {
        if (A = true, p.replaceChildren(), !G.altKey) {
          const E = this.snap({ ...o, x: o.x + D, y: o.y + x }, m, _, p);
          D = E.x - o.x, x = E.y - o.y;
        }
        for (const E of P) E.style.transform = `translate(${D}px, ${x}px)`;
      }
    }, k = () => {
      e.removeEventListener("pointermove", w), e.removeEventListener("pointerup", k), e.removeEventListener("pointercancel", k), p.remove(), A && this.moveGroup(t, r, D, x);
    };
    e.addEventListener("pointermove", w), e.addEventListener("pointerup", k), e.addEventListener("pointercancel", k);
  }
  snap(n, t, e, r) {
    const o = (a, s, i, l) => {
      let h = fa + 1, m = a, _ = -1;
      for (const p of [0, s / 2, s]) for (const P of i) {
        const D = Math.abs(a + p - P);
        D < h && (h = D, m = P - p, _ = P);
      }
      return _ >= 0 && r.append(y("div", { class: "oguide " + (l ? "v" : "h"), style: l ? { left: _ + "px" } : { top: _ + "px" } })), m;
    };
    return { ...n, x: o(n.x, n.w, t, true), y: o(n.y, n.h, e, false) };
  }
  pageMap(n, t, e) {
    const r = e.w / t.w, o = e.h / t.h, a = new yt(r, 0, 0, o, e.x - t.x * r, e.y - t.y * o), s = Xt(n.inv, Xt(a, n.tf));
    return [s.a, s.b, s.c, s.d, s.e, s.f];
  }
  moveItem(n, t, e, r) {
    const o = this.app.doc, a = n.index;
    if (t.kind === "annot") {
      const l = n.inv.apply(0, 0), h = n.inv.apply(e, r);
      o.moveAnnot(a, t.annot, h[0] - l[0], h[1] - l[1]);
      return;
    }
    const s = n.tf.box(t.bounds), i = this.pageMap(n, s, { ...s, x: s.x + e, y: s.y + r });
    t.kind === "block" ? o.transformBlock(a, t.block, i, 1) : o.transformObjects(a, t.objs, i);
  }
  resizeItem(n, t, e, r) {
    const o = this.app.doc, a = n.index;
    if (!t.resizable || t.ft || t.line) return false;
    if (t.uniform) {
      const i = r.w / e.w !== 1 ? r.w / e.w : r.h / e.h;
      r = { x: r.x, y: r.y, w: e.w * i, h: e.h * i };
    }
    if (t.kind === "annot") {
      const i = [n.inv.apply(r.x, r.y), n.inv.apply(r.x + r.w, r.y + r.h)];
      return o.resizeAnnot(a, t.annot, { l: Math.min(i[0][0], i[1][0]), r: Math.max(i[0][0], i[1][0]), b: Math.min(i[0][1], i[1][1]), t: Math.max(i[0][1], i[1][1]) }), true;
    }
    const s = this.pageMap(n, e, r);
    return t.kind === "block" ? o.transformBlock(a, t.block, s, t.uniform ? r.w / e.w : 1) : o.transformObjects(a, t.objs, s), true;
  }
  moveGroup(n, t, e, r, o = `Move ${t.length} objects`) {
    !e && !r || this.app.mutate(o, { pages: [n.index] }, () => {
      for (const a of t) this.moveItem(n, a, e, r);
    }).catch((a) => H(a.message, "err"));
  }
  align(n) {
    const t = this.selected();
    if (!t.length) return;
    const e = this.v.views[this.sel.page], r = t.length === 1 ? { x: 0, y: 0, w: e.w * this.v.zoom, h: e.h * this.v.zoom } : this.groupBox(e, t), o = { left: "left", hcenter: "centre", right: "right", top: "top", vmiddle: "middle", bottom: "bottom" };
    this.app.mutate(t.length === 1 ? `Align to page ${o[n]}` : `Align ${o[n]}`, { pages: [e.index] }, () => {
      for (const a of t) {
        const s = e.tf.box(a.bounds);
        let i = 0, l = 0;
        n === "left" ? i = r.x - s.x : n === "right" ? i = r.x + r.w - (s.x + s.w) : n === "hcenter" ? i = r.x + r.w / 2 - (s.x + s.w / 2) : n === "top" ? l = r.y - s.y : n === "bottom" ? l = r.y + r.h - (s.y + s.h) : l = r.y + r.h / 2 - (s.y + s.h / 2), (Math.abs(i) > 0.01 || Math.abs(l) > 0.01) && this.moveItem(e, a, i, l);
      }
    }).catch((a) => H(a.message, "err"));
  }
  distribute(n) {
    const t = this.selected();
    if (t.length < 3) return H("Select three or more objects to distribute them", "warn");
    const e = this.v.views[this.sel.page], r = t.map((h) => ({ it: h, b: e.tf.box(h.bounds) })), o = (h) => n === "h" ? h.x : h.y, a = (h) => n === "h" ? h.w : h.h;
    r.sort((h, m) => o(h.b) + a(h.b) / 2 - (o(m.b) + a(m.b) / 2));
    const s = o(r[0].b), l = (o(r[r.length - 1].b) + a(r[r.length - 1].b) - s - r.reduce((h, m) => h + a(m.b), 0)) / (r.length - 1);
    this.app.mutate(n === "h" ? "Distribute across" : "Distribute down", { pages: [e.index] }, () => {
      let h = s;
      for (const { it: m, b: _ } of r) {
        const p = h - o(_);
        Math.abs(p) > 0.01 && this.moveItem(e, m, n === "h" ? p : 0, n === "v" ? p : 0), h += a(_) + l;
      }
    }).catch((h) => H(h.message, "err"));
  }
  matchSize(n) {
    const t = this.selected();
    if (t.length < 2) return H("Select two or more objects; the others take the size of the one you clicked last", "warn");
    const e = this.v.views[this.sel.page], r = e.tf.box(t[0].bounds);
    let o = 0;
    this.app.mutate(n === "w" ? "Match width" : n === "h" ? "Match height" : "Match size", { pages: [e.index] }, () => {
      for (const a of t.slice(1)) {
        const s = e.tf.box(a.bounds), i = { x: s.x, y: s.y, w: n === "h" ? s.w : r.w, h: n === "w" ? s.h : r.h };
        this.resizeItem(e, a, s, i) || o++;
      }
    }).then(() => {
      o && H(`${o} object${o === 1 ? "" : "s"} (text boxes, lines or notes) kept ${o === 1 ? "its" : "their"} size`, "warn");
    }).catch((a) => H(a.message, "err"));
  }
  restack(n) {
    const t = this.selected();
    if (!t.length) return;
    const e = this.sel.page, r = t.filter((i) => i.kind !== "annot").flatMap((i) => i.objs), o = t.filter((i) => i.kind === "annot").map((i) => i.annot), a = { front: "Bring to front", back: "Send to back", forward: "Bring forward", backward: "Send backward" };
    let s = false;
    this.app.mutate(a[n], { pages: [e] }, () => {
      if (r.length && this.app.doc.restackObjects(e, r, n) && (s = true), o.length && this.app.doc.restackAnnots(e, o, n) && (s = true), !s) throw new Error(n === "front" || n === "forward" ? "Already in front of what it overlaps" : "Already behind what it overlaps");
    }).then(() => {
      this.sel = null, this.extra = [], this.refresh(), this.onChange();
    }).catch((i) => H(i.message, "warn"));
  }
  dragEnd(n, t, e, r) {
    const o = t.ov;
    o.setPointerCapture(n.pointerId);
    const a = e.ft, s = a ? { x: (a.box.l + a.box.r) / 2, y: (a.box.t + a.box.b) / 2 } : e.line[1 - r];
    let i = a ? a.tip : e.line[r], l = false;
    const h = t.svg, m = (p) => {
      const P = o.getBoundingClientRect(), [D, x] = t.inv.apply(p.clientX - P.left, p.clientY - P.top);
      if (i = { x: D, y: x }, p.shiftKey) {
        const E = D - s.x, B = x - s.y, z = Math.hypot(E, B), O = Math.round(Math.atan2(B, E) / (Math.PI / 4)) * (Math.PI / 4);
        i = { x: s.x + z * Math.cos(O), y: s.y + z * Math.sin(O) };
      }
      l = true;
      const [A, w] = t.tf.apply(s.x, s.y), [k, G] = t.tf.apply(i.x, i.y);
      h.replaceChildren(Pc(A, w, k, G));
    }, _ = () => {
      if (o.removeEventListener("pointermove", m), o.removeEventListener("pointerup", _), o.removeEventListener("pointercancel", _), h.replaceChildren(), !l || Math.hypot(i.x - s.x, i.y - s.y) < 2) return;
      if (a) {
        this.onFreeText(t.index, e.annot, (D) => ({ ...D, tip: i }), "Point callout");
        return;
      }
      const [p, P] = r === 0 ? [i, s] : [s, i];
      this.app.mutate("Edit line", { pages: [t.index] }, () => this.app.doc.setLinePoints(t.index, e.annot, p, P)).catch((D) => H(D.message, "err"));
    };
    o.addEventListener("pointermove", m), o.addEventListener("pointerup", _), o.addEventListener("pointercancel", _);
  }
  apply(n, t, e, r) {
    const o = r.w / e.w, a = r.h / e.h, s = new yt(o, 0, 0, a, r.x - e.x * o, r.y - e.y * a), i = Xt(n.inv, Xt(s, n.tf)), l = [i.a, i.b, i.c, i.d, i.e, i.f], h = Math.abs(o - 1) > 1e-3 || Math.abs(a - 1) > 1e-3, m = h ? `Resize ${t.label.toLowerCase()}` : `Move ${t.label.toLowerCase()}`, _ = this.app.doc, p = n.index;
    if (t.wrap && Math.abs(a - 1) < 1e-3 && Math.abs(o - 1) > 1e-3) {
      const P = t.wrap, D = Math.hypot(P.bm[0], P.bm[1]) || 1, x = r.x - e.x, A = n.inv.apply(e.x, e.y), w = n.inv.apply(e.x + x, e.y), k = (n.ov.clientWidth / n.w || this.v.zoom) * D, G = { ...P, width: Math.max(12, P.width + (r.w - e.w) / k), bm: [P.bm[0], P.bm[1], P.bm[2], P.bm[3], P.bm[4] + (w[0] - A[0]), P.bm[5] + (w[1] - A[1])] };
      this.app.mutate("Reflow text", { pages: [p] }, async () => {
        gt(_, p, t.block), await tr(_, p, G, t.block);
      }).catch((E) => H(E.message, "err"));
      return;
    }
    if (t.ft) {
      const P = [n.inv.apply(r.x, r.y), n.inv.apply(r.x + r.w, r.y + r.h)], D = { l: Math.min(P[0][0], P[1][0]), r: Math.max(P[0][0], P[1][0]), b: Math.min(P[0][1], P[1][1]), t: Math.max(P[0][1], P[1][1]) };
      this.onFreeText(p, t.annot, (x) => ({ ...x, box: D }), m);
      return;
    }
    this.app.mutate(m, { pages: [p] }, () => {
      if (t.kind === "annot") if (h) {
        const P = [n.inv.apply(r.x, r.y), n.inv.apply(r.x + r.w, r.y + r.h)];
        _.resizeAnnot(p, t.annot, { l: Math.min(P[0][0], P[1][0]), r: Math.max(P[0][0], P[1][0]), b: Math.min(P[0][1], P[1][1]), t: Math.max(P[0][1], P[1][1]) });
      } else {
        const P = n.inv.apply(e.x, e.y), D = n.inv.apply(r.x, r.y);
        _.moveAnnot(p, t.annot, D[0] - P[0], D[1] - P[1]);
      }
      else t.kind === "block" ? _.transformBlock(p, t.block, l, t.uniform ? o : 1) : _.transformObjects(p, t.objs, l);
    }).catch((P) => H(P.message, "err"));
  }
  nudge(n, t) {
    const e = this.sel;
    if (!e) return false;
    if (this.extra.length) {
      const i = this.v.views[e.page], l = this.v.zoom;
      return this.moveGroup(i, this.selected(i), n * l, t * l), true;
    }
    const r = this.v.views[e.page], o = r && this.itemsOf(r).find((i) => i.key === e.key);
    if (!o) return false;
    const a = r.tf.box(o.bounds), s = this.v.zoom;
    return this.apply(r, o, a, { ...a, x: a.x + n * s, y: a.y + t * s }), true;
  }
  removeItems(n, t, e) {
    const r = this.app.doc, o = t.filter((s) => s.kind === "annot").map((s) => s.annot).sort((s, i) => i - s), a = t.filter((s) => s.kind !== "annot").flatMap((s) => s.objs);
    if (this.sel?.page === n) {
      const s = new Set(t.map((i) => i.key));
      s.has(this.sel.key) && (this.sel = null), this.extra = this.extra.filter((i) => !s.has(i)), !this.sel && this.extra.length && (this.sel = { page: n, key: this.extra.shift() });
    }
    return this.app.mutate(e, { pages: [n] }, () => {
      for (const s of o) r.deleteAnnot(n, s);
      a.length && Fn(r, n, a);
    });
  }
  remove() {
    const n = this.sel;
    if (!n) return false;
    if (this.extra.length) {
      const a = this.selected(), s = this.app.doc, i = n.page;
      this.sel = null, this.extra = [];
      const l = a.filter((m) => m.kind === "annot").map((m) => m.annot).sort((m, _) => _ - m), h = a.filter((m) => m.kind !== "annot").flatMap((m) => m.objs);
      return this.app.mutate(`Delete ${a.length} objects`, { pages: [i] }, () => {
        for (const m of l) s.deleteAnnot(i, m);
        h.length && Fn(s, i, h);
      }).catch((m) => H(m.message, "err")), true;
    }
    const t = this.v.views[n.page], e = t && this.itemsOf(t).find((a) => a.key === n.key);
    if (!e) return false;
    const r = this.app.doc, o = n.page;
    return this.sel = null, this.app.mutate(`Delete ${e.label.toLowerCase()}`, { pages: [o] }, () => {
      e.kind === "annot" ? r.deleteAnnot(o, e.annot) : Fn(r, o, e.objs);
    }).catch((a) => H(a.message, "err")), true;
  }
  canDuplicate(n) {
    return n.kind === "annot" ? n.label !== "Link" && n.label !== "Form field" : n.kind === "image" && n.label === "Image";
  }
  clipOf(n, t = this.selected()) {
    const e = t.filter((s) => this.canDuplicate(s)), r = t.length - e.length;
    if (!e.length) return null;
    const { items: o, skipped: a } = this.app.doc.readClip(n, e.filter((s) => s.kind === "annot").map((s) => s.annot), e.filter((s) => s.kind === "image").flatMap((s) => s.objs));
    return o.length ? { items: o, bounds: Jt(e.map((s) => s.bounds)), skipped: r + a } : null;
  }
  async paste(n, t, e, r, o) {
    const a = this.app.doc, s = this.app.settings.author;
    let i = [];
    try {
      await this.app.mutate(o, { pages: [n] }, async () => {
        i = a.writeClip(n, t, e, r, s);
        for (const l of t) {
          if (l.t !== "ft") continue;
          const h = l.data, m = a.createFreeText(n, s);
          await ko(a, n, m, { ...h, box: { l: h.box.l + e, r: h.box.r + e, t: h.box.t + r, b: h.box.b + r }, tip: h.tip ? { x: h.tip.x + e, y: h.tip.y + r } : void 0 }), i.push("a" + m);
        }
      });
    } catch (l) {
      return H(l.message, "err"), [];
    }
    return this.app.tool === "arrange" && i.length && (this.invalidate(n), this.sel = { page: n, key: i[0] }, this.extra = i.slice(1), this.refresh(), this.onChange()), i;
  }
  screenOffset(n, t = 12, e = t) {
    const r = this.v.views[n];
    if (!r) return [t, -e];
    const o = this.v.zoom, a = r.inv.apply(0, 0), s = r.inv.apply(t * o, e * o);
    return [s[0] - a[0], s[1] - a[1]];
  }
  async duplicate(n, t = this.selected()) {
    const e = this.clipOf(n, t);
    if (!e) return H("Only annotations and pictures can be duplicated", "warn"), [];
    e.skipped && H(`${e.skipped} object${e.skipped === 1 ? "" : "s"} (text, links, form fields or markup) ${e.skipped === 1 ? "wasn’t" : "weren’t"} duplicated`, "warn");
    const [r, o] = this.screenOffset(n);
    return this.paste(n, e.items, r, o, e.items.length > 1 ? `Duplicate ${e.items.length} objects` : "Duplicate");
  }
  itemOfAnnot(n, t) {
    const e = this.v.views[n];
    return e ? (this.app.tool !== "arrange" && this.items.delete(n), this.itemsOf(e).find((r) => r.key === "a" + t) || null) : null;
  }
  current() {
    const n = this.sel;
    if (!n || this.extra.length) return null;
    const t = this.v.views[n.page];
    return t && this.itemsOf(t).find((e) => e.key === n.key) || null;
  }
  turn(n) {
    const t = this.sel, e = this.current();
    if (!t || !e || e.kind !== "image") return;
    const r = this.v.views[t.page], o = r.tf.box(e.bounds), a = o.x + o.w / 2, s = o.y + o.h / 2, i = n === "rotl" ? new yt(0, -1, 1, 0, 0, 0) : n === "rotr" ? new yt(0, 1, -1, 0, 0, 0) : n === "fliph" ? new yt(-1, 0, 0, 1, 0, 0) : new yt(1, 0, 0, -1, 0, 0), l = Xt(new yt(1, 0, 0, 1, a, s), Xt(i, new yt(1, 0, 0, 1, -a, -s))), h = Xt(r.inv, Xt(l, r.tf)), m = { rotl: "Rotate image left", rotr: "Rotate image right", fliph: "Flip image", flipv: "Flip image" }[n];
    this.app.mutate(m, { pages: [t.page] }, () => this.app.doc.transformObjects(t.page, e.objs, [h.a, h.b, h.c, h.d, h.e, h.f])).catch((_) => H(_.message, "err"));
  }
  cropping = null;
  startCrop() {
    const n = this.sel, t = this.current();
    !n || !t || t.kind !== "image" || t.label !== "Image" || (this.cropping = { page: n.page, key: n.key, obj: t.objs[0], f: { x0: 0, y0: 0, x1: 1, y1: 1 } }, this.refresh(), this.onChange());
  }
  cancelCrop() {
    this.cropping = null, this.refresh(), this.onChange();
  }
  async applyCrop(n) {
    const t = this.cropping;
    if (!t) return;
    this.cropping = null;
    const { x0: e, y0: r, x1: o, y1: a } = t.f;
    if (o - e > 0.995 && a - r > 0.995) {
      this.refresh(), this.onChange();
      return;
    }
    const s = this.app.doc, i = s.imageInfo(t.page, t.obj), l = s.imagePixels(t.page, t.obj);
    if (!i || !l) {
      H("This image can’t be cropped", "err");
      return;
    }
    const h = Math.max(0, Math.floor(e * l.w)), m = Math.min(l.w, Math.ceil(o * l.w)), _ = Math.max(0, Math.floor((1 - a) * l.h)), p = Math.min(l.h, Math.ceil((1 - r) * l.h)), P = Math.max(1, m - h), D = Math.max(1, p - _), x = new Uint8ClampedArray(P * D * 4);
    for (let Y = 0; Y < D; Y++) x.set(l.rgba.subarray(((_ + Y) * l.w + h) * 4, ((_ + Y) * l.w + h + P) * 4), Y * P * 4);
    const A = await n(x, P, D, i.jpeg), w = h / l.w, k = (h + P) / l.w, G = 1 - (_ + D) / l.h, E = 1 - _ / l.h, [B, z, O, W, N, V] = i.matrix, q = [B * (k - w), z * (k - w), O * (E - G), W * (E - G), N + B * w + O * G, V + z * w + W * G];
    await this.app.mutate("Crop image", { pages: [t.page] }, () => s.setImage(t.page, t.obj, A, q)).catch((Y) => H(Y.message, "err"));
  }
  async replaceImage(n, t, e) {
    const r = this.sel, o = this.current();
    if (!r || !o || o.kind !== "image" || o.label !== "Image") return;
    const a = this.app.doc, s = this.v.views[r.page], i = s.tf.box(o.bounds), l = t / e, h = Math.min(i.w, i.h * l), m = h / l, _ = ps(s, { x: i.x + (i.w - h) / 2, y: i.y + (i.h - m) / 2, w: h, h: m });
    await this.app.mutate("Replace image", { pages: [r.page] }, () => a.setImage(r.page, o.objs[0], n, _)).catch((p) => H(p.message, "err"));
  }
  cropOverlay(n) {
    const t = this.cropping;
    if (!t || t.page !== n.index) return false;
    const e = this.itemsOf(n).find((w) => w.key === t.key), r = this.app.doc.imageInfo(t.page, t.obj);
    if (!e || !r) return false;
    const [o, a, s, i, l, h] = r.matrix, m = (w, k) => n.tf.apply(o * w + s * k + l, a * w + i * k + h), _ = (w) => {
      const k = [m(w.x0, w.y0), m(w.x1, w.y1)], G = Math.min(k[0][0], k[1][0]), E = Math.min(k[0][1], k[1][1]);
      return { x: G, y: E, w: Math.abs(k[1][0] - k[0][0]), h: Math.abs(k[1][1] - k[0][1]) };
    }, p = _({ x0: 0, y0: 0, x1: 1, y1: 1 }), P = y("div", { class: "cropsel" });
    for (const w of ma) P.append(y("span", { class: "ohandle " + w, "data-h": w }));
    const D = () => {
      const w = _(t.f);
      Object.assign(P.style, { left: w.x + "px", top: w.y + "px", width: w.w + "px", height: w.h + "px" });
    };
    D(), n.ov.append(y("div", { class: "crop-image-area", style: { left: p.x + "px", top: p.y + "px", width: p.w + "px", height: p.h + "px" } }), P);
    const x = Xt(n.tf, new yt(o, a, s, i, l, h)), A = x.invert();
    return P.addEventListener("pointerdown", (w) => {
      w.stopPropagation(), w.preventDefault();
      const k = w.target.closest(".ohandle")?.dataset.h || "move", G = n.ov.getBoundingClientRect(), E = { ...t.f }, [B, z] = A.apply(w.clientX - G.left, w.clientY - G.top);
      P.setPointerCapture(w.pointerId);
      const O = (N) => {
        const [V, q] = A.apply(N.clientX - G.left, N.clientY - G.top), Y = V - B, ne = q - z, J = { ...E }, ee = (ae) => Math.max(0, Math.min(1, ae));
        if (k === "move") {
          const ae = E.x1 - E.x0, de = E.y1 - E.y0;
          J.x0 = ee(E.x0 + Y), J.y0 = ee(E.y0 + ne), J.x0 = Math.min(J.x0, 1 - ae), J.y0 = Math.min(J.y0, 1 - de), J.x1 = J.x0 + ae, J.y1 = J.y0 + de;
        } else {
          const ae = Math.abs(x.a) >= Math.abs(x.c) ? { ax: "x", sg: Math.sign(x.a) } : { ax: "y", sg: Math.sign(x.c) }, de = Math.abs(x.b) >= Math.abs(x.d) ? { ax: "x", sg: Math.sign(x.b) } : { ax: "y", sg: Math.sign(x.d) }, oe = (fe, we) => {
            const ce = fe.sg > 0 === we, Ge = fe.ax + (ce ? "1" : "0");
            J[Ge] = ee(E[Ge] + (fe.ax === "x" ? Y : ne));
          };
          if (k.includes("e") && oe(ae, true), k.includes("w") && oe(ae, false), k.includes("s") && oe(de, true), k.includes("n") && oe(de, false), J.x0 > J.x1 || J.y0 > J.y1 || J.x1 - J.x0 < 0.02 || J.y1 - J.y0 < 0.02) return;
        }
        t.f = J, D();
      }, W = () => {
        P.removeEventListener("pointermove", O), P.removeEventListener("pointerup", W), this.onChange();
      };
      P.addEventListener("pointermove", O), P.addEventListener("pointerup", W);
    }), true;
  }
  refresh() {
    for (const n of this.v.views) n.ov.dataset.tool === "arrange" && n.visible && (n.ov.replaceChildren(), this.overlay(n));
  }
}
function Xt(u, n) {
  return new yt(u.a * n.a + u.c * n.b, u.b * n.a + u.d * n.b, u.a * n.c + u.c * n.d, u.b * n.c + u.d * n.d, u.a * n.e + u.c * n.f + u.e, u.b * n.e + u.d * n.f + u.f);
}
function Pc(u, n, t, e) {
  const r = document.createElementNS("http://www.w3.org/2000/svg", "line");
  for (const [o, a] of Object.entries({ x1: u, y1: n, x2: t, y2: e })) r.setAttribute(o, String(a));
  return r.setAttribute("stroke", "var(--sel)"), r.setAttribute("stroke-width", "2"), r.setAttribute("stroke-dasharray", "4 3"), r;
}
function Dc(u, n, t, e) {
  const r = e[0] - t[0], o = e[1] - t[1], a = r * r + o * o, s = a ? Math.max(0, Math.min(1, ((u - t[0]) * r + (n - t[1]) * o) / a)) : 0;
  return Math.hypot(u - (t[0] + s * r), n - (t[1] + s * o));
}
const yc = ["nw", "n", "ne", "e", "se", "s", "sw", "w"], _a = 36;
class wc {
  app;
  v;
  sel = null;
  onChange = () => {
  };
  constructor(n, t) {
    this.app = n, this.v = t;
  }
  toRect(n, t) {
    const e = [n.inv.apply(t.x, t.y), n.inv.apply(t.x + t.w, t.y + t.h)];
    return { l: Math.min(e[0][0], e[1][0]), r: Math.max(e[0][0], e[1][0]), b: Math.min(e[0][1], e[1][1]), t: Math.max(e[0][1], e[1][1]) };
  }
  zoomOf(n) {
    return n.ov.clientWidth / n.w || this.v.zoom;
  }
  overlay(n) {
    const t = this.sel;
    if (!t || t.page !== n.index) return;
    const e = n.tf.box(t.rect);
    n.ov.append(this.frame(n, e));
  }
  frame(n, t) {
    const e = this.zoomOf(n), r = y("div", { class: "cropsel", style: { left: t.x + "px", top: t.y + "px", width: t.w + "px", height: t.h + "px" } }, y("span", { class: "olabel", text: `${Math.round(t.w / e)} × ${Math.round(t.h / e)} pt` }));
    for (const o of yc) r.append(y("span", { class: "ohandle " + o, "data-h": o }));
    return r;
  }
  refresh() {
    for (const n of this.v.views) n.ov.dataset.tool === "crop" && n.visible && (n.ov.replaceChildren(), this.overlay(n));
  }
  down(n, t) {
    if (n.button !== 0) return;
    n.preventDefault();
    const e = t.ov.getBoundingClientRect(), r = n.clientX - e.left, o = n.clientY - e.top, a = t.ov.clientWidth, s = t.ov.clientHeight, i = (w) => {
      const k = Math.max(0, w.x), G = Math.max(0, w.y);
      return { x: k, y: G, w: Math.min(a, w.x + w.w) - k, h: Math.min(s, w.y + w.h) - G };
    }, l = n.target.closest(".ohandle")?.dataset.h, h = this.sel?.page === t.index ? t.tf.box(this.sel.rect) : null, m = h && r >= h.x && r <= h.x + h.w && o >= h.y && o <= h.y + h.h, _ = l && h ? l : m ? "move" : "new";
    _ === "new" && this.sel && this.sel.page !== t.index && (this.sel = null, this.refresh());
    let p = h || { x: r, y: o, w: 0, h: 0 };
    t.ov.setPointerCapture(n.pointerId);
    let P = t.ov.querySelector(".cropsel");
    const D = () => {
      P || (P = this.frame(t, p), t.ov.replaceChildren(P)), Object.assign(P.style, { left: p.x + "px", top: p.y + "px", width: p.w + "px", height: p.h + "px" });
      const w = this.zoomOf(t);
      P.querySelector(".olabel").textContent = `${Math.round(p.w / w)} × ${Math.round(p.h / w)} pt`;
    }, x = (w) => {
      const k = Math.max(0, Math.min(a, w.clientX - e.left)), G = Math.max(0, Math.min(s, w.clientY - e.top));
      if (_ === "new") p = { x: Math.min(r, k), y: Math.min(o, G), w: Math.abs(k - r), h: Math.abs(G - o) };
      else if (_ === "move") {
        const E = Math.max(-h.x, Math.min(a - h.x - h.w, k - r)), B = Math.max(-h.y, Math.min(s - h.y - h.h, G - o));
        p = { ...h, x: h.x + E, y: h.y + B };
      } else {
        let { x: E, y: B } = h, z = h.x + h.w, O = h.y + h.h;
        _.includes("w") && (E = Math.min(k, z - 10)), _.includes("e") && (z = Math.max(k, E + 10)), _.includes("n") && (B = Math.min(G, O - 10)), _.includes("s") && (O = Math.max(G, B + 10)), p = i({ x: E, y: B, w: z - E, h: O - B });
      }
      D();
    }, A = () => {
      t.ov.removeEventListener("pointermove", x), t.ov.removeEventListener("pointerup", A), t.ov.removeEventListener("pointercancel", A);
      const w = this.zoomOf(t);
      if (p.w / w < 10 || p.h / w < 10) {
        _ === "new" && (this.sel = null, this.refresh(), this.onChange());
        return;
      }
      this.sel = { page: t.index, rect: this.toRect(t, p) }, this.refresh(), this.onChange();
    };
    t.ov.addEventListener("pointermove", x), t.ov.addEventListener("pointerup", A), t.ov.addEventListener("pointercancel", A);
  }
  async apply(n) {
    const t = this.sel;
    if (!t) return;
    this.sel = null;
    const e = this.app.doc, r = e.pageBoxes(t.page).crop, o = { l: t.rect.l - r.l, b: t.rect.b - r.b, r: r.r - t.rect.r, t: r.t - t.rect.t };
    let a = 0;
    await this.app.mutate(n.length > 1 ? "Crop pages" : "Crop page", { pages: "all", structure: true }, () => {
      for (const i of n) {
        const l = e.pageBoxes(i).crop, h = { l: l.l + o.l, b: l.b + o.b, r: l.r - o.r, t: l.t - o.t };
        if (h.r - h.l < _a || h.t - h.b < _a) {
          a++;
          continue;
        }
        e.setCropBox(i, h);
      }
    }).catch((i) => H(i.message, "err")), this.onChange();
    const s = n.length - a;
    H(a ? `Cropped ${s} page${s === 1 ? "" : "s"}; ${a} too small to crop that much` : `Cropped ${s} page${s === 1 ? "" : "s"}`, a ? "warn" : "ok");
  }
  isCropped(n) {
    const { media: t, crop: e } = this.app.doc.pageBoxes(n);
    return Math.abs(t.l - e.l) + Math.abs(t.b - e.b) + Math.abs(t.r - e.r) + Math.abs(t.t - e.t) > 0.5;
  }
  async reset(n) {
    const t = n.filter((e) => this.isCropped(e));
    t.length && (this.sel = null, await this.app.mutate("Remove crop", { pages: "all", structure: true }, () => {
      for (const e of t) this.app.doc.setCropBox(e, null);
    }).catch((e) => H(e.message, "err")), H(`Restored ${t.length} page${t.length === 1 ? "" : "s"} to full size`));
  }
}
const vc = (() => {
  const u = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let t = n;
    for (let e = 0; e < 8; e++) t = t & 1 ? 3988292384 ^ t >>> 1 : t >>> 1;
    u[n] = t >>> 0;
  }
  return u;
})(), xc = (u) => {
  let n = 4294967295;
  for (let t = 0; t < u.length; t++) n = vc[(n ^ u[t]) & 255] ^ n >>> 8;
  return (n ^ 4294967295) >>> 0;
};
function vs(u) {
  const n = new TextEncoder(), t = [], e = [];
  let r = 0;
  const o = /* @__PURE__ */ new Date(), a = o.getHours() << 11 | o.getMinutes() << 5 | o.getSeconds() >> 1, s = o.getFullYear() - 1980 << 9 | o.getMonth() + 1 << 5 | o.getDate();
  for (const p of u) {
    const P = n.encode(p.name), D = xc(p.data), x = p.data.length, A = new DataView(new ArrayBuffer(30));
    A.setUint32(0, 67324752, true), A.setUint16(4, 20, true), A.setUint16(6, 2048, true), A.setUint16(8, 0, true), A.setUint16(10, a, true), A.setUint16(12, s, true), A.setUint32(14, D, true), A.setUint32(18, x, true), A.setUint32(22, x, true), A.setUint16(26, P.length, true), A.setUint16(28, 0, true), t.push(new Uint8Array(A.buffer), P, p.data);
    const w = new DataView(new ArrayBuffer(46));
    w.setUint32(0, 33639248, true), w.setUint16(4, 20, true), w.setUint16(6, 20, true), w.setUint16(8, 2048, true), w.setUint16(10, 0, true), w.setUint16(12, a, true), w.setUint16(14, s, true), w.setUint32(16, D, true), w.setUint32(20, x, true), w.setUint32(24, x, true), w.setUint16(28, P.length, true), w.setUint32(42, r, true), e.push(new Uint8Array(w.buffer), P), r += 30 + P.length + x;
  }
  const i = e.reduce((p, P) => p + P.length, 0), l = new DataView(new ArrayBuffer(22));
  l.setUint32(0, 101010256, true), l.setUint16(8, u.length, true), l.setUint16(10, u.length, true), l.setUint32(12, i, true), l.setUint32(16, r, true);
  const h = [...t, ...e, new Uint8Array(l.buffer)], m = new Uint8Array(h.reduce((p, P) => p + P.length, 0));
  let _ = 0;
  for (const p of h) m.set(p, _), _ += p.length;
  return m;
}
function xr(u, n, t, e, r) {
  const o = /* @__PURE__ */ new Map(), a = (l) => {
    let h = o.get(l);
    if (h) return h;
    h = l;
    let m = 2;
    for (; r.has(h); ) h = `${l}_${m++}`;
    return o.set(l, h), r.add(h), h;
  }, s = [], i = /* @__PURE__ */ new Map();
  for (const [l, h] of n.entries()) {
    const m = e + l, _ = u.fields(h).filter((p) => p.type !== ye.PUSHBUTTON);
    if (!(!_.length && !t.fields(m).length)) {
      t.removeWidgets(m);
      for (const p of _) {
        const P = p.type === ye.TEXT ? p.multiline ? "multiline" : "text" : p.type === ye.CHECKBOX ? "checkbox" : p.type === ye.RADIO ? "radio" : p.type === ye.COMBO ? "dropdown" : p.type === ye.LIST ? "list" : p.type === ye.SIGNATURE ? "signature" : null;
        if (!P) continue;
        const D = a(p.name || "Field"), x = t.createField(m, P, p.rect, D, { options: p.options.map((w) => w.label), onValue: p.exportValue || "On", joinTo: P === "radio" ? i.get(D) : void 0 });
        P === "radio" && !i.has(D) && i.set(D, { page: m, annot: x });
        const A = p.options.findIndex((w) => w.selected);
        s.push({ page: m, name: D, kind: P, value: p.value, checked: p.checked, exportValue: p.exportValue, selected: A >= 0 ? A : p.options.findIndex((w) => w.label === p.value), options: p.options.map((w) => w.label) });
      }
    }
  }
  return s;
}
async function Ar(u, n, t) {
  const e = u.open(za(n));
  for (const r of t) {
    const o = e.fields(r.page).filter((s) => s.name === r.name), a = r.kind === "radio" ? o.find((s) => s.exportValue === r.exportValue) : o[0];
    a && ((r.kind === "text" || r.kind === "multiline") && r.value ? (e.setFieldText(r.page, a.index, r.value), ar(r.value) && await ns(e, r.page, a.index, r.value)) : (r.kind === "checkbox" || r.kind === "radio") && r.checked && !a.checked ? e.clickField(r.page, a.index) : (r.kind === "dropdown" || r.kind === "list") && (a.options.map((s) => s.label).join(`
`) !== r.options.join(`
`) && e.setFieldOptions(r.page, a.index, r.options), r.selected >= 0 && e.selectOption(r.page, a.index, r.selected)));
  }
  return e;
}
function pa(u) {
  const n = /* @__PURE__ */ new Set();
  for (let t = 0; t < u.pageCount; t++) for (const e of u.fields(t)) n.add(e.name);
  return n;
}
function ir(u, n) {
  const t = /* @__PURE__ */ new Set(), e = u.trim();
  if (!e) throw new Error("Enter the pages to extract");
  for (const r of e.split(/[,;\s]+/).filter(Boolean)) {
    const o = r.match(/^(\d*)\s*[-–]\s*(\d*)$/) || r.match(/^(\d+)$/);
    if (!o) throw new Error(`“${r}” isn’t a page or a range`);
    const a = o[2] === void 0 || o[1] ? +o[1] : 1, s = o[2] === void 0 ? +o[1] : o[2] ? +o[2] : n;
    if (a < 1 || s > n || a > s) throw new Error(`Pages go from 1 to ${n}`);
    for (let i = a; i <= s; i++) t.add(i - 1);
  }
  return [...t].sort((r, o) => r - o);
}
function ln(u) {
  const n = [];
  for (let t = 0; t < u.length; ) {
    let e = t;
    for (; e + 1 < u.length && u[e + 1] === u[e] + 1; ) e++;
    n.push(e > t ? `${u[t] + 1}-${u[e] + 1}` : `${u[t] + 1}`), t = e + 1;
  }
  return n.join(", ");
}
async function Ac(u, n, t, e) {
  const r = u.doc.pageCount, o = y("input", { class: "tinput", id: "ex-range", value: ln(t), placeholder: "e.g. 1-3, 5, 8-", autocomplete: "off" }), a = y("input", { class: "rnum", type: "number", min: "1", max: String(r), value: "2", id: "ex-every", "aria-label": "Pages per file" }), s = (k, G, E = false) => y("label", { class: "hf-check" }, y("input", { type: "radio", name: "ex-mode", value: k, checked: E }), ...G), i = y("input", { type: "checkbox", id: "ex-del" }), l = y("p", { class: "modal-text", id: "ex-status" }), h = y("div", { class: "stack extract" }, y("label", { class: "rfield" }, y("span", { class: "rlabel", text: `Pages (of ${r})` }), o), y("div", { class: "stack", role: "radiogroup", "aria-label": "Output" }, s("one", ["As one PDF"], true), s("each", ["One PDF per page"]), s("every", ["Split every ", a, " pages"])), y("label", { class: "hf-check" }, i, "Remove these pages from this document afterwards"), l), m = () => h.querySelector("input[name=ex-mode]:checked").value, _ = () => {
    const k = ir(o.value, r), G = m();
    if (G === "one") return [k];
    const E = G === "each" ? 1 : Math.max(1, Math.floor(+a.value || 1)), B = [];
    for (let z = 0; z < k.length; z += E) B.push(k.slice(z, z + E));
    return B;
  }, p = () => {
    try {
      const k = _(), G = k.reduce((E, B) => E + B.length, 0);
      l.textContent = k.length === 1 ? `${G} page${G === 1 ? "" : "s"} → 1 PDF` : `${G} pages → ${k.length} PDFs, saved together as a .zip`, l.classList.remove("err"), i.disabled = G >= r, i.disabled && (i.checked = false);
    } catch (k) {
      l.textContent = k.message, l.classList.add("err");
    }
  };
  if (h.addEventListener("input", p), h.addEventListener("change", p), p(), await nt({ title: "Extract pages", body: h, actions: [{ id: "cancel", label: "Cancel" }, { id: "go", label: "Extract", primary: true }] }) !== "go") return;
  let D;
  try {
    D = _();
  } catch (k) {
    H(k.message, "warn");
    return;
  }
  const x = u.fileName.replace(/\.pdf$/i, ""), A = (k) => k.length === 1 ? `${x}_page${k[0] + 1}.pdf` : `${x}_pages${ln(k).replace(/, /g, "_")}.pdf`, w = [];
  for (const k of D) {
    let G = n.create();
    try {
      if (!G.importIndices(u.doc, k, 0)) throw new Error("Those pages could not be copied");
      const E = xr(u.doc, k, G, 0, /* @__PURE__ */ new Set());
      if (E.length) {
        const B = await Ar(n, G.save(), E);
        G.close(), G = B;
      }
      w.push({ name: A(k), data: G.save() });
    } finally {
      G.close();
    }
  }
  if (w.length === 1 ? await e(w[0].data, w[0].name, "application/pdf") : await e(vs(w), `${x}_split.zip`, "application/zip"), i.checked) {
    const k = D.flat().sort((G, E) => E - G);
    await u.mutate(`Remove ${k.length} extracted page${k.length === 1 ? "" : "s"}`, { pages: "all", structure: true }, () => {
      for (const G of k) u.doc.deletePage(G);
      u.selectedPages.clear();
    });
  }
}
let nr = null;
const kc = () => nr?.close(), Zr = () => !!nr;
function pn(u, n, t, e) {
  kc();
  const r = [], o = y("div", { class: "ctxmenu", role: "menu", tabindex: "-1" }, ...t.map((A) => {
    if (A === "sep") return y("div", { class: "ctx-sep", role: "separator" });
    if ("heading" in A) return y("div", { class: "ctx-head", text: A.heading });
    if ("swatches" in A) return y("div", { class: "ctx-swatches", role: "group", "aria-label": A.label }, y("span", { class: "ctx-label", text: A.label }), y("span", { class: "ctx-sw" }, ...A.swatches.map((k, G) => {
      const E = y("button", { class: "sw" + (k.text != null ? " chip" : "") + (k.css === "none" ? " none" : "") + (k.custom ? " custom" : "") + (k.on ? " on" : ""), type: "button", role: "menuitemradio", "aria-checked": String(k.on), "aria-label": k.label, title: k.label, disabled: !!A.disabled, tabindex: "-1", text: k.text, style: k.css && k.css !== "none" ? { background: k.css } : {} });
      return E.addEventListener("click", () => {
        if (A.disabled) return;
        if (!k.custom) return x(), A.pick(G);
        // custom colour: the browser's own picker, opened while this click still counts as the user's
        document.querySelector("input.ctx-picker")?.remove();
        const B = E.getBoundingClientRect(), z = y("input", { type: "color", class: "ctx-picker", value: k.value || "#3b82f6", style: { position: "fixed", left: B.left + "px", top: B.top + "px", width: "1px", height: "1px", opacity: "0", border: "0", padding: "0" } });
        document.body.append(z), z.addEventListener("change", () => {
          const O = z.value;
          z.remove(), A.pick(G, [parseInt(O.slice(1, 3), 16), parseInt(O.slice(3, 5), 16), parseInt(O.slice(5, 7), 16), 255]);
        }), x();
        try {
          z.showPicker ? z.showPicker() : z.click();
        } catch {
          z.click();
        }
      }), r.push(E), E;
    })));
    const w = y("button", { class: "ctx-item" + (A.danger ? " danger" : ""), type: "button", role: "menuitem", disabled: !!A.disabled, tabindex: "-1" }, y("span", { class: "ctx-label", text: A.label }), A.shortcut ? y("span", { class: "ctx-key", text: A.shortcut }) : null);
    return w.addEventListener("click", () => {
      A.disabled || (x(), A.run());
    }), w.addEventListener("pointerenter", () => {
      A.disabled || w.focus();
    }), r.push(w), w;
  }));
  document.body.append(o);
  const a = o.getBoundingClientRect(), s = innerWidth, i = innerHeight;
  o.style.left = Math.max(4, Math.min(u, s - a.width - 4)) + "px", o.style.top = Math.max(4, n + a.height > i - 4 ? n - a.height : n) + "px";
  const l = () => r.filter((A) => !A.disabled), h = (A) => {
    const w = l();
    if (!w.length) return;
    const k = w.indexOf(document.activeElement);
    w[(k + A + w.length) % w.length].focus();
  }, m = (A) => {
    if (A.key === "Escape") {
      A.preventDefault(), x();
      return;
    }
    A.key === "ArrowDown" || A.key === "ArrowRight" && document.activeElement?.classList.contains("sw") ? (A.preventDefault(), h(1)) : A.key === "ArrowLeft" && document.activeElement?.classList.contains("sw") || A.key === "ArrowUp" ? (A.preventDefault(), h(-1)) : A.key === "Home" ? (A.preventDefault(), l()[0]?.focus()) : A.key === "End" ? (A.preventDefault(), l().at(-1)?.focus()) : A.key === "Tab" && (A.preventDefault(), h(A.shiftKey ? -1 : 1)), A.stopPropagation();
  }, _ = (A) => {
    o.contains(A.target) || x();
  }, p = performance.now(), P = () => x(), D = (A) => {
    performance.now() - p > 300 && !o.contains(A.target) && x();
  };
  o.addEventListener("keydown", m), o.addEventListener("contextmenu", (A) => A.preventDefault()), setTimeout(() => {
    document.addEventListener("pointerdown", _, true), addEventListener("blur", P), addEventListener("resize", P), document.addEventListener("scroll", D, true);
  }, 0);
  function x() {
    nr?.el === o && (nr = null, o.remove(), document.removeEventListener("pointerdown", _, true), removeEventListener("blur", P), removeEventListener("resize", P), document.removeEventListener("scroll", D, true), e?.focus({ preventScroll: true }));
  }
  nr = { el: o, close: x }, (l()[0] || o).focus({ preventScroll: true });
}
const Ec = -3392, _n = { print: 2052, copy: 16, comment: 288, edit: 1032 };
async function Sc(u) {
  const { encrypted: n } = u.doc.security();
  if (n && u.limits.locked) return Cc(u);
  const t = (w, k) => {
    const G = y("input", { class: "tinput", type: "password", id: w, autocomplete: "new-password", "aria-label": k });
    return { el: G, row: y("label", { class: "stack-field" }, y("span", { class: "rlabel", text: k }), G) };
  }, e = t("pr-open", "Password"), r = t("pr-open2", "Type it again"), o = t("pr-owner", "Permissions password"), a = t("pr-owner2", "Type it again"), s = y("input", { type: "checkbox", id: "pr-need-open", checked: true }), i = y("input", { type: "checkbox", id: "pr-limit" }), l = Object.fromEntries(Object.keys(_n).map((w) => [w, y("input", { type: "checkbox", id: "pr-allow-" + w, checked: w === "print" || w === "copy" })])), h = y("div", { class: "stack pr-sub" }, e.row, r.row), m = y("div", { class: "stack pr-sub" }, o.row, a.row, y("span", { class: "rlabel", text: "Without it, people can:" }), y("label", { class: "hf-check" }, l.print, "Print"), y("label", { class: "hf-check" }, l.copy, "Copy text and images"), y("label", { class: "hf-check" }, l.comment, "Add comments and fill in forms"), y("label", { class: "hf-check" }, l.edit, "Edit, and add or remove pages")), _ = () => {
    h.hidden = !s.checked, m.hidden = !i.checked;
  };
  s.addEventListener("change", _), i.addEventListener("change", _), _();
  const p = y("div", { class: "stack protect" }, n ? y("p", { class: "modal-text", text: "This PDF is already protected. Set new passwords below to replace its protection, or remove it." }) : null, y("label", { class: "hf-check" }, s, "Require a password to open the document"), h, y("label", { class: "hf-check" }, i, "Limit printing, copying and editing"), m, y("p", { class: "hint", text: "Encrypted with AES-256. Keep the passwords somewhere safe: they can’t be recovered. Margin keeps them only while this file is open." })), P = await nt({ title: n ? "Protection" : "Protect with a password", body: p, actions: [...n ? [{ id: "remove", label: "Remove protection", danger: true }] : [], { id: "cancel", label: "Cancel" }, { id: "ok", label: n ? "Replace protection" : "Protect", primary: true }] });
  if (P === "remove") {
    await u.unprotect().then(() => H("Protection removed. Save to keep the unprotected copy.")).catch((w) => H(w.message, "err", 6e3));
    return;
  }
  if (P !== "ok") return;
  const D = s.checked ? e.el.value : "", x = i.checked ? o.el.value : "";
  if (s.checked && !D) return H("Enter a password to open the document, or untick that option", "warn");
  if (s.checked && D !== r.el.value) return H("The two passwords to open the document don’t match", "warn");
  if (i.checked && !x) return H("Enter a permissions password, or untick “Limit printing, copying and editing”", "warn");
  if (i.checked && x !== a.el.value) return H("The two permissions passwords don’t match", "warn");
  if (i.checked && x === D) return H("Use a permissions password that differs from the password to open, or anyone who can open the file can lift the limits", "warn", 6e3);
  if (!D && !x) return H("Choose at least one: a password to open, or limits with a permissions password", "warn");
  let A = Ec;
  if (i.checked) for (const w of Object.keys(_n)) l[w].checked && (A |= _n[w]);
  else A |= _n.print | _n.copy | _n.comment | _n.edit;
  await u.protect(D, x || D, A).then(() => H(`Protected${D ? " with a password to open it" : ""}${x ? (D ? " and" : " with") + " limits" : ""}. Save to keep the protected copy.`)).catch((w) => H(w.message, "err", 6e3));
}
async function Cc(u) {
  const { perms: n } = u.limits, t = [n & 4 ? "print" : "", n & 16 ? "copy text" : "", n & 32 ? "add comments" : n & 256 ? "fill in forms" : ""].filter(Boolean), e = y("input", { class: "tinput", type: "password", id: "pr-unlock", autocomplete: "off", "aria-label": "Permissions password" });
  await nt({ title: "This PDF limits changes", body: y("div", { class: "stack" }, y("p", { class: "modal-text", text: `Without its permissions password you can ${t.length ? t.join(", ") : "only read it"}. Enter that password to edit it or change its protection.` }), y("label", { class: "stack-field" }, y("span", { class: "rlabel", text: "Permissions password" }), e)), actions: [{ id: "cancel", label: "Cancel" }, { id: "ok", label: "Unlock", primary: true }], onOpen: () => {
    e.focus(), e.addEventListener("keydown", (o) => {
      o.key === "Enter" && document.querySelector(".modal .btn.primary")?.click();
    });
  } }) === "ok" && (u.unlock(e.value) ? H("Unlocked: you can edit this PDF. Its protection stays when you save.") : H("That isn’t the permissions password", "err"));
}
async function xs(u, n, t, e, r, o, a) {
  const s = [], i = document.createElement("canvas"), l = i.getContext("2d");
  for (let h = 0; h < n.length; h++) {
    if (!a(h)) return null;
    await new Promise((k) => setTimeout(k, 0));
    const m = n[h], { w: _, h: p } = u.doc.pageSize(m);
    let P = Math.round(_ / 72 * t), D = Math.round(p / 72 * t);
    const x = 8e3 / Math.max(P, D);
    x < 1 && (P = Math.round(P * x), D = Math.round(D * x)), u.relieveMemory(m);
    const A = u.doc.render(m, P, D, { annots: e, print: true });
    i.width = A.width, i.height = A.height, l.putImageData(A, 0, 0);
    const w = await new Promise((k) => i.toBlob(k, r, o));
    if (!w) throw new Error(`Page ${m + 1} could not be rendered`);
    s.push({ page: m, blob: w, w: _, h: p });
  }
  return i.width = i.height = 0, s;
}
async function Fa(u) {
  const { locked: n, perms: t } = u.limits;
  if (n && !(t & 4)) return H("This PDF’s permissions don’t allow printing. Unlock it with its permissions password first.", "warn", 5e3);
  const e = u.doc.pageCount, r = [...u.selectedPages].sort((A, w) => A - w), o = (A, w, k = false) => y("label", { class: "hf-check" }, y("input", { type: "radio", name: "pr-pages", value: A, checked: k }), w), a = y("input", { class: "tinput", id: "print-range", value: r.length ? ln(r) : `1-${e}`, placeholder: "e.g. 1-3, 5", autocomplete: "off" }), s = y("input", { type: "checkbox", id: "print-annots", checked: true }), i = y("select", { class: "tinput", id: "print-quality" }, y("option", { value: "150", text: "Standard (150 dpi)" }), y("option", { value: "300", text: "High (300 dpi, slower)" })), l = y("div", { class: "stack" }, y("div", { class: "stack", role: "radiogroup", "aria-label": "Pages" }, o("all", `All pages (${e})`, !r.length), o("current", `Current page (${u.currentPage + 1})`), ...r.length ? [o("sel", `Selected pages (${ln(r)})`, true)] : [], y("label", { class: "hf-check" }, y("input", { type: "radio", name: "pr-pages", value: "range" }), "Pages ", a)), y("label", { class: "hf-check" }, s, "Comments and markup"), y("label", { class: "rfield" }, y("span", { class: "rlabel", text: "Quality" }), i), y("p", { class: "hint", text: "Choose the printer, paper size and copies in the next step." }));
  if (a.addEventListener("focus", () => {
    l.querySelector("input[value=range]").checked = true;
  }), await nt({ title: "Print", body: l, actions: [{ id: "cancel", label: "Cancel" }, { id: "ok", label: "Print…", primary: true }] }) !== "ok") return;
  const m = l.querySelector("input[name=pr-pages]:checked").value;
  let _;
  try {
    _ = m === "all" ? [...Array(e).keys()] : m === "current" ? [u.currentPage] : m === "sel" ? r : ir(a.value, e);
  } catch (A) {
    return H(A.message, "warn");
  }
  const p = +i.value;
  let P = false;
  const D = H(`Preparing page 1 of ${_.length}…`, "ok", 6e5, { label: "Cancel", run: () => {
    P = true;
  } });
  let x;
  try {
    x = await xs(u, _, p, s.checked, "image/jpeg", 0.92, (A) => (D?.set?.(`Preparing page ${A + 1} of ${_.length}…`), !P));
  } catch (A) {
    return D?.close?.(), H(A.message, "err");
  }
  D?.close?.(), x && Mc(x);
}
function Mc(u) {
  document.getElementById("print-root")?.remove();
  const n = u.map((r) => URL.createObjectURL(r.blob)), t = y("div", { id: "print-root", "aria-hidden": "true" }, ...u.map((r, o) => y("div", { class: "print-page" + (r.w > r.h ? " landscape" : "") }, y("img", { src: n[o], alt: "" }))));
  document.body.append(t);
  const e = () => {
    t.remove(), n.forEach((r) => URL.revokeObjectURL(r)), removeEventListener("afterprint", e);
  };
  addEventListener("afterprint", e), Promise.all([...t.querySelectorAll("img")].map((r) => r.decode().catch(() => {
  }))).then(() => {
    try {
      window.print();
    } catch {
      H("Printing isn’t available here. Save the PDF and print it from your PDF viewer.", "warn", 6e3), e();
    }
  });
}
const _t = (u) => u.join(".");
class Gc {
  el;
  app;
  v;
  tree;
  empty;
  items = [];
  open = /* @__PURE__ */ new Set();
  sel = null;
  onCount = () => {
  };
  constructor(n, t) {
    this.app = n, this.v = t, this.tree = y("div", { class: "bm-tree", role: "tree", "aria-label": "Bookmarks" }), this.empty = y("div", { class: "empty-note" }, y("p", { text: "No bookmarks yet." }), y("p", { class: "hint", text: "Add one to mark the page you’re looking at. Bookmarks are saved in the PDF, so other readers see them too." }));
    const e = y("button", { class: "btn ghost small", type: "button", title: "Bookmark the current view", onclick: () => this.addHere() }, Ve("plus"), "Add bookmark");
    this.el = y("div", { class: "bm-pane" }, y("div", { class: "bm-actions" }, e), this.empty, this.tree), this.tree.addEventListener("keydown", (r) => this.key(r)), n.on(() => this.refresh());
  }
  refresh() {
    try {
      this.items = this.app.doc.outline();
    } catch {
      this.items = [];
    }
    const n = (e) => e.reduce((r, o) => r + 1 + n(o.children), 0);
    this.onCount(n(this.items)), this.empty.hidden = this.items.length > 0, this.tree.replaceChildren(...this.items.map((e) => this.row(e, 1)));
    const t = this.sel && this.tree.querySelector(`[data-path="${this.sel}"]`);
    t && t.classList.add("sel");
  }
  row(n, t) {
    const e = _t(n.path), r = this.open.has(e), o = n.children.length > 0, a = y("div", { class: "bm-row" + (this.sel === e ? " sel" : ""), role: "treeitem", tabindex: this.sel === e || !this.sel && e === "0" ? "0" : "-1", "data-path": e, "aria-level": String(t), ...o ? { "aria-expanded": String(r) } : {}, title: n.uri ? n.uri : n.page >= 0 ? `Page ${n.page + 1}` : "No target", style: { paddingLeft: 6 + (t - 1) * 14 + "px" } }, y("button", { class: "bm-twist" + (o ? "" : " none"), type: "button", tabindex: "-1", "aria-hidden": "true", text: o ? r ? "▾" : "▸" : "", onclick: (i) => {
      i.stopPropagation(), this.toggle(e);
    } }), y("span", { class: "bm-title", text: n.title || "Untitled" }), y("span", { class: "bm-page", text: n.page >= 0 ? String(n.page + 1) : n.uri ? "↗" : "" }));
    a.addEventListener("click", () => {
      this.select(e), this.go(n);
    }), a.addEventListener("dblclick", (i) => {
      i.preventDefault(), this.rename(n);
    }), a.addEventListener("contextmenu", (i) => {
      i.preventDefault(), this.select(e), this.menu(n, i.clientX, i.clientY, a);
    });
    const s = y("div", { class: "bm-node", role: "none" }, a);
    return o && r && s.append(y("div", { role: "group" }, ...n.children.map((i) => this.row(i, t + 1)))), s;
  }
  find(n, t = this.items) {
    for (const e of t) {
      if (_t(e.path) === n) return e;
      const r = this.find(n, e.children);
      if (r) return r;
    }
    return null;
  }
  siblings(n) {
    const t = n.path.length > 1 ? this.find(_t(n.path.slice(0, -1))) : null;
    return t ? t.children : this.items;
  }
  select(n) {
    this.sel = n, this.tree.querySelectorAll(".bm-row").forEach((t) => {
      const e = t.dataset.path === n;
      t.classList.toggle("sel", e), t.tabIndex = e ? 0 : -1;
    });
  }
  focus(n) {
    this.select(n), this.tree.querySelector(`[data-path="${n}"]`)?.focus();
  }
  toggle(n, t) {
    t ?? !this.open.has(n) ? this.open.add(n) : this.open.delete(n), this.refresh(), this.focus(n);
  }
  go(n) {
    if (n.uri) {
      try {
        window.open(n.uri, "_blank", "noopener");
      } catch {
        H(n.uri);
      }
      return;
    }
    if (n.page < 0 || n.page >= this.app.doc.pageCount) return H("This bookmark doesn’t point to a page", "warn");
    this.v.scrollToPoint(n.page, n.top);
  }
  async edit(n, t) {
    await this.app.mutate(n, { pages: [] }, t).catch((e) => H(e.message, "err"));
  }
  async addHere(n = false) {
    const { page: t, y: e } = this.v.viewTop(), r = this.sel ? this.find(this.sel) : null, o = r ? n ? r.path : r.path.slice(0, -1) : [], a = r ? n ? r.children.length : r.path[r.path.length - 1] + 1 : this.items.length, s = this.suggestTitle(t);
    await this.edit("Add bookmark", () => this.app.doc.addBookmark(o, a, s, t, e));
    const i = _t([...o, a]);
    n && r && this.open.add(_t(r.path)), this.refresh(), this.select(i);
    const l = this.find(i);
    l && this.rename(l);
  }
  suggestTitle(n) {
    try {
      const r = this.app.doc.textObjects(n).filter((o) => o.text.trim().length >= 3).reduce((o, a) => !o || a.fontSize > o.fontSize + 0.5 ? a : o, null)?.text.trim();
      if (r) return r.length > 60 ? r.slice(0, 59) + "…" : r;
    } catch {
    }
    return `Page ${n + 1}`;
  }
  rename(n) {
    const t = _t(n.path), e = this.tree.querySelector(`[data-path="${t}"]`);
    if (!e) return;
    const r = e.querySelector(".bm-title"), o = y("input", { class: "bm-edit", value: n.title, "aria-label": "Bookmark name" });
    r.replaceWith(o), o.focus(), o.select();
    let a = false;
    const s = async (i) => {
      if (a) return;
      a = true;
      const l = o.value.trim();
      i && l && l !== n.title ? await this.edit("Rename bookmark", () => this.app.doc.renameBookmark(n.path, l)) : this.refresh(), this.focus(t);
    };
    o.addEventListener("keydown", (i) => {
      i.stopPropagation(), i.key === "Enter" ? s(true) : i.key === "Escape" && s(false);
    }), o.addEventListener("blur", () => s(true)), o.addEventListener("click", (i) => i.stopPropagation());
  }
  moves(n) {
    const t = this.siblings(n), e = n.path[n.path.length - 1], r = n.path.slice(0, -1);
    return { up: e > 0 ? () => this.move(n, r, e - 1, _t([...r, e - 1])) : null, down: e < t.length - 1 ? () => this.move(n, r, e + 2, _t([...r, e + 1])) : null, indent: e > 0 ? () => {
      const o = t[e - 1];
      this.open.add(_t(o.path)), this.move(n, o.path, o.children.length, _t([...o.path, o.children.length]));
    } : null, outdent: r.length ? () => {
      const o = r.slice(0, -1), a = r[r.length - 1];
      this.move(n, o, a + 1, _t([...o, a + 1]));
    } : null };
  }
  async move(n, t, e, r) {
    const o = this.open.has(_t(n.path));
    this.open = new Set([...this.open].filter((a) => !a.startsWith(_t(n.path)))), await this.edit("Move bookmark", () => this.app.doc.moveBookmark(n.path, t, e)), o && (this.open.add(r), this.refresh()), this.focus(r);
  }
  async remove(n) {
    const t = (r) => r.reduce((o, a) => o + 1 + t(a.children), 0), e = t(n.children);
    await this.edit(e ? `Delete bookmark and ${e} under it` : "Delete bookmark", () => this.app.doc.deleteBookmark(n.path)), this.sel = null, this.refresh();
  }
  menu(n, t, e, r) {
    const o = this.moves(n), { locked: a, perms: s } = this.app.limits, i = !a || !!(s & 8), { page: l } = this.v.viewTop();
    pn(t, e, [{ heading: n.title.length > 32 ? n.title.slice(0, 31) + "…" : n.title || "Bookmark" }, { label: n.uri ? "Open link" : "Go to bookmark", run: () => this.go(n) }, { label: "Rename", shortcut: "F2", disabled: !i, run: () => this.rename(n) }, { label: `Point to the current view (page ${l + 1})`, disabled: !i, run: () => {
      const h = this.v.viewTop();
      this.edit("Change bookmark target", () => this.app.doc.retargetBookmark(n.path, h.page, h.y));
    } }, "sep", { label: "Add bookmark after", disabled: !i, run: () => this.addHere(false) }, { label: "Add bookmark inside", disabled: !i, run: () => this.addHere(true) }, "sep", { label: "Move up", shortcut: "Alt+↑", disabled: !i || !o.up, run: () => o.up?.() }, { label: "Move down", shortcut: "Alt+↓", disabled: !i || !o.down, run: () => o.down?.() }, { label: "Indent", shortcut: "Alt+→", disabled: !i || !o.indent, run: () => o.indent?.() }, { label: "Outdent", shortcut: "Alt+←", disabled: !i || !o.outdent, run: () => o.outdent?.() }, "sep", { label: n.children.length ? "Delete with its children" : "Delete", shortcut: "Del", danger: true, disabled: !i, run: () => this.remove(n) }], r);
  }
  key(n) {
    const t = n.target.closest(".bm-row");
    if (!t || n.target.tagName === "INPUT") return;
    const e = t.dataset.path, r = this.find(e);
    if (!r) return;
    const o = [...this.tree.querySelectorAll(".bm-row")], a = o.indexOf(t), s = this.moves(r), i = () => {
      n.preventDefault(), n.stopPropagation();
    };
    if (n.altKey && n.key === "ArrowUp") i(), s.up?.();
    else if (n.altKey && n.key === "ArrowDown") i(), s.down?.();
    else if (n.altKey && n.key === "ArrowRight") i(), s.indent?.();
    else if (n.altKey && n.key === "ArrowLeft") i(), s.outdent?.();
    else if (n.key === "ArrowDown") i(), o[a + 1] && this.focus(o[a + 1].dataset.path);
    else if (n.key === "ArrowUp") i(), o[a - 1] && this.focus(o[a - 1].dataset.path);
    else if (n.key === "ArrowRight") i(), r.children.length && !this.open.has(e) ? this.toggle(e, true) : r.children.length && this.focus(_t(r.children[0].path));
    else if (n.key === "ArrowLeft") i(), this.open.has(e) ? this.toggle(e, false) : r.path.length > 1 && this.focus(_t(r.path.slice(0, -1)));
    else if (n.key === "Enter") i(), this.go(r);
    else if (n.key === "F2") i(), this.rename(r);
    else if (n.key === "Delete" || n.key === "Backspace") i(), this.remove(r);
    else if (n.key === "ContextMenu" || n.shiftKey && n.key === "F10") {
      i();
      const l = t.getBoundingClientRect();
      this.menu(r, l.left + 24, l.bottom, t);
    }
  }
}
async function Tc(u, n) {
  const { locked: t, perms: e } = u.limits;
  if (t && !(e & 16)) return H("This PDF’s permissions don’t allow copying its content. Unlock it with its permissions password first.", "warn", 5e3);
  const r = u.doc.pageCount, o = [...u.selectedPages].sort((q, Y) => q - Y), a = (q, Y, ne = false) => y("label", { class: "hf-check" }, y("input", { type: "radio", name: "ei-pages", value: q, checked: ne }), Y), s = y("input", { class: "tinput", id: "ei-range", value: o.length ? ln(o) : `1-${r}`, autocomplete: "off" }), i = y("select", { class: "tinput", id: "ei-format" }, y("option", { value: "png", text: "PNG (sharp, larger)" }), y("option", { value: "jpeg", text: "JPEG (smaller, for photos)" })), l = y("select", { class: "tinput", id: "ei-dpi" }, ...[[72, "Screen (72 dpi)"], [150, "Standard (150 dpi)"], [300, "Print (300 dpi)"], [600, "Very high (600 dpi)"]].map(([q, Y]) => y("option", { value: String(q), text: String(Y), selected: q === 150 }))), h = y("input", { type: "range", id: "ei-quality", min: "50", max: "100", value: "90", "aria-label": "JPEG quality" }), m = y("span", { class: "rlabel", text: "90" }), _ = y("label", { class: "rfield" }, y("span", { class: "rlabel", text: "Quality" }), h, m), p = y("input", { type: "checkbox", id: "ei-annots", checked: true }), P = y("p", { class: "hint", id: "ei-size" }), D = y("div", { class: "stack" }, y("div", { class: "stack", role: "radiogroup", "aria-label": "Pages" }, a("all", `All pages (${r})`, !o.length), a("current", `Current page (${u.currentPage + 1})`), ...o.length ? [a("sel", `Selected pages (${ln(o)})`, true)] : [], y("label", { class: "hf-check" }, y("input", { type: "radio", name: "ei-pages", value: "range" }), "Pages ", s)), y("label", { class: "rfield" }, y("span", { class: "rlabel", text: "Format" }), i), y("label", { class: "rfield" }, y("span", { class: "rlabel", text: "Resolution" }), l), _, y("label", { class: "hf-check" }, p, "Include comments and markup"), P), x = () => {
    const q = D.querySelector("input[name=ei-pages]:checked").value;
    return q === "all" ? [...Array(r).keys()] : q === "current" ? [u.currentPage] : q === "sel" ? o : ir(s.value, r);
  }, A = () => {
    _.hidden = i.value !== "jpeg", m.textContent = h.value;
    try {
      const q = x(), { w: Y, h: ne } = u.doc.pageSize(q[0] ?? 0), J = +l.value;
      P.textContent = `${q.length} image${q.length === 1 ? "" : "s"}, about ${Math.round(Y / 72 * J)} × ${Math.round(ne / 72 * J)} px${q.length > 1 ? ", saved together as a .zip" : ""}`, P.classList.remove("err");
    } catch (q) {
      P.textContent = q.message, P.classList.add("err");
    }
  };
  if (s.addEventListener("focus", () => {
    D.querySelector("input[value=range]").checked = true, A();
  }), D.addEventListener("input", A), D.addEventListener("change", A), A(), await nt({ title: "Export pages as images", body: D, actions: [{ id: "cancel", label: "Cancel" }, { id: "ok", label: "Export", primary: true }] }) !== "ok") return;
  let k;
  try {
    k = x();
  } catch (q) {
    return H(q.message, "warn");
  }
  const G = i.value === "jpeg" ? "image/jpeg" : "image/png", E = i.value === "jpeg" ? "jpg" : "png";
  let B = false;
  const z = H(`Rendering page 1 of ${k.length}…`, "ok", 6e5, { label: "Cancel", run: () => {
    B = true;
  } });
  let O;
  try {
    O = await xs(u, k, +l.value, p.checked, G, +h.value / 100, (q) => (z.set(`Rendering page ${q + 1} of ${k.length}…`), !B));
  } catch (q) {
    return z.close(), H(q.message, "err");
  }
  if (z.close(), !O) return;
  const W = u.fileName.replace(/\.pdf$/i, ""), N = String(r).length, V = await Promise.all(O.map(async (q) => ({ name: `${W}_page${String(q.page + 1).padStart(N, "0")}.${E}`, data: new Uint8Array(await q.blob.arrayBuffer()) })));
  V.length === 1 ? await n(V[0].data, V[0].name, G) : await n(vs(V), `${W}_${E}.zip`, "application/zip");
}
const Qr = { high: { label: "High quality", note: "images up to 200 dpi, light JPEG compression", dpi: 200, q: 0.85 }, balanced: { label: "Balanced", note: "images up to 150 dpi, good for screens and office printing", dpi: 150, q: 0.75 }, small: { label: "Smallest file", note: "images up to 100 dpi, for email and the web", dpi: 100, q: 0.6 } }, gr = (u) => u >= 1048576 ? (u / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(u / 1024)) + " KB";
async function Oc(u, n) {
  if (u.fileSize > n) return H("Files over 600 MB can’t be compressed here: it rewrites the whole file, which needs more memory than a browser tab has.", "warn", 6e3);
  const { locked: t, perms: e } = u.limits;
  if (t && !(e & 8)) return H("This PDF’s permissions don’t allow changes. Unlock it with its permissions password first.", "warn", 5e3);
  const r = u.exportBytes().length, o = (B, z) => y("label", { class: "hf-check cp-preset" }, y("input", { type: "radio", name: "cp", value: B, checked: z }), y("span", {}, y("b", { text: Qr[B].label }), y("span", { class: "hint", text: " — " + Qr[B].note }))), a = y("div", { class: "stack" }, y("p", { class: "modal-text", text: `Now ${gr(r)}. Compressing shrinks images that are sharper than they need to be; text and drawings stay exactly as they are.` }), y("div", { class: "stack", role: "radiogroup", "aria-label": "Compression" }, o("high", false), o("balanced", true), o("small", false)), y("p", { class: "hint", text: "You can undo this. The smaller size applies when you save." }));
  if (await nt({ title: "Compress", body: a, actions: [{ id: "cancel", label: "Cancel" }, { id: "ok", label: "Compress", primary: true }] }) !== "ok") return;
  const i = Qr[a.querySelector("input[name=cp]:checked").value], l = u.doc.pageCount, h = [];
  for (let B = 0; B < l; B++) {
    u.relieveMemory(B);
    for (const z of u.doc.imageList(B)) h.push({ page: B, ...z });
  }
  const m = /* @__PURE__ */ new Map();
  for (const B of h) m.set(B.print, (m.get(B.print) || 0) + 1);
  let _ = false, p = 0, P = 0, D = 0;
  const x = H("Compressing…", "ok", 6e5, { label: "Cancel", run: () => {
    _ = true;
  } }), A = document.createElement("canvas"), w = A.getContext("2d");
  try {
    await u.mutate("Compress", { pages: "all" }, async () => {
      for (let B = 0; B < h.length; B++) {
        if (_) throw new Error("Compression cancelled");
        const z = h[B];
        if (x.set(`Compressing image ${B + 1} of ${h.length}…`), await new Promise((ee) => setTimeout(ee, 0)), (m.get(z.print) || 0) > 1) continue;
        const O = Math.min(z.w / Math.max(z.ptW / 72, 1e-3), z.h / Math.max(z.ptH / 72, 1e-3)), W = Math.min(1, i.dpi / O), N = W < 0.85;
        if (!N && (z.jpeg || z.bytes < 2e5)) {
          D++;
          continue;
        }
        const V = u.doc.imagePixels(z.page, z.k);
        if (!V) {
          D++;
          continue;
        }
        let q = false;
        for (let ee = 3; ee < V.rgba.length; ee += 4) if (V.rgba[ee] < 255) {
          q = true;
          break;
        }
        const Y = Math.max(1, Math.round(V.w * W)), ne = Math.max(1, Math.round(V.h * W));
        A.width = V.w, A.height = V.h, w.putImageData(new ImageData(V.rgba, V.w, V.h), 0, 0);
        let J;
        if (q) {
          if (!N) {
            D++;
            continue;
          }
          const ee = document.createElement("canvas");
          ee.width = Y, ee.height = ne;
          const ae = ee.getContext("2d");
          ae.imageSmoothingQuality = "high", ae.drawImage(A, 0, 0, Y, ne), J = { rgba: ae.getImageData(0, 0, Y, ne).data, w: Y, h: ne };
        } else {
          const ee = document.createElement("canvas");
          ee.width = Y, ee.height = ne;
          const ae = ee.getContext("2d");
          ae.fillStyle = "#fff", ae.fillRect(0, 0, Y, ne), ae.imageSmoothingQuality = "high", ae.drawImage(A, 0, 0, Y, ne);
          const de = await new Promise((oe) => ee.toBlob(oe, "image/jpeg", i.q));
          if (!de || de.size > z.bytes * 0.9) {
            D++;
            continue;
          }
          J = { jpeg: new Uint8Array(await de.arrayBuffer()) };
        }
        u.doc.setImage(z.page, z.k, J), p++;
      }
    });
  } catch (B) {
    return x.close(), H(B.message, _ ? "warn" : "err");
  } finally {
    A.width = A.height = 0;
  }
  x.close(), P = [...m.values()].filter((B) => B > 1).length;
  const k = u.exportBytes().length, G = Math.round((1 - k / r) * 100), E = P ? ` ${P === 1 ? "One image is" : P + " images are"} used on several pages and ${P === 1 ? "was" : "were"} left as ${P === 1 ? "it is" : "they are"}.` : "";
  k >= r ? H(`No smaller: the images here are already compact (${gr(r)}).${E}`, "warn", 7e3) : H(`${gr(r)} → ${gr(k)} (${G}% smaller), ${p} image${p === 1 ? "" : "s"} recompressed. Save to keep it.${E}`, "ok", 8e3);
}
function Rc(u) {
  return u && u.__esModule && Object.prototype.hasOwnProperty.call(u, "default") ? u.default : u;
}
/*!
* Determine if an object is a Buffer
*
* @author   Feross Aboukhadijeh <https://feross.org>
* @license  MIT
*/
var eo, ga;
function Ic() {
  return ga || (ga = 1, eo = function(n) {
    return n != null && n.constructor != null && typeof n.constructor.isBuffer == "function" && n.constructor.isBuffer(n);
  }), eo;
}
var to, ba;
function As() {
  if (ba) return to;
  ba = 1, to = n;
  var u = [];
  function n(t, e) {
    var r = 0, o;
    if (!e) return u;
    if (t.FLAG === "long") {
      for (o = new Array(Math.ceil(e.length / 2)); r < e.length; ) o[r / 2] = e.slice(r, r + 2), r += 2;
      return o;
    }
    return e.split(t.FLAG === "num" ? "," : "");
  }
  return to;
}
var no, Pa;
function Lc() {
  if (Pa) return no;
  Pa = 1;
  var u = As();
  no = o;
  var n = [].push, t = "etaoinshrdlcumwfgypbvkjxqz".split(""), e = /\s+/, r = ["qwertzuop", "yxcvbnm", "qaw", "say", "wse", "dsx", "sy", "edr", "fdc", "dx", "rft", "gfv", "fc", "tgz", "hgb", "gv", "zhu", "jhn", "hb", "uji", "kjm", "jn", "iko", "lkm"];
  function o(i) {
    var l = /* @__PURE__ */ Object.create(null), h = /* @__PURE__ */ Object.create(null), m = /* @__PURE__ */ Object.create(null), _ = [], p = { in: [], out: [] }, P = [], D = i.toString("utf8"), x = [], A = 0, w = D.indexOf(`
`), k, G, E, B, z, O, W, N, V, q, Y, ne, J;
    for (m.KEY = []; w > -1; ) ee(D.slice(A, w)), A = w + 1, w = D.indexOf(`
`, A);
    for (ee(D.slice(A)), w = -1; ++w < x.length; ) if (G = x[w], k = G.split(e), E = k[0], E === "REP") {
      for (B = w + parseInt(k[1], 10); ++w <= B; ) k = x[w].split(e), _.push([k[1], k[2]]);
      w--;
    } else if (E === "ICONV" || E === "OCONV") {
      for (B = w + parseInt(k[1], 10), N = p[E === "ICONV" ? "in" : "out"]; ++w <= B; ) k = x[w].split(e), N.push([new RegExp(k[1], "g"), k[2]]);
      w--;
    } else if (E === "COMPOUNDRULE") {
      for (B = w + parseInt(k[1], 10); ++w <= B; ) for (q = x[w].split(e)[1], V = -1, P.push(q); ++V < q.length; ) h[q.charAt(V)] = [];
      w--;
    } else if (E === "PFX" || E === "SFX") {
      for (B = w + parseInt(k[3], 10), q = { type: E, combineable: k[2] === "Y", entries: [] }, l[k[1]] = q; ++w <= B; ) {
        k = x[w].split(e), z = k[2], O = k[3].split("/"), W = k[4], N = { add: "", remove: "", match: "", continuation: u(m, O[1]) }, O && O[0] !== "0" && (N.add = O[0]);
        try {
          z !== "0" && (N.remove = E === "SFX" ? a(z) : z), W && W !== "." && (N.match = E === "SFX" ? a(W) : s(W));
        } catch {
          N = null;
        }
        N && q.entries.push(N);
      }
      w--;
    } else if (E === "TRY") {
      for (W = k[1], ne = -1, Y = []; ++ne < W.length; ) J = W.charAt(ne), J.toLowerCase() === J && Y.push(J);
      for (ne = -1; ++ne < t.length; ) W.indexOf(t[ne]) < 0 && Y.push(t[ne]);
      m[E] = Y;
    } else E === "KEY" ? n.apply(m[E], k[1].split("|")) : E === "COMPOUNDMIN" ? m[E] = Number(k[1]) : E === "ONLYINCOMPOUND" ? (m[E] = k[1], h[k[1]] = []) : m[E] = k[1];
    return isNaN(m.COMPOUNDMIN) && (m.COMPOUNDMIN = 3), m.KEY.length || (m.KEY = r), m.TRY || (m.TRY = t.concat()), m.KEEPCASE || (m.KEEPCASE = false), { compoundRuleCodes: h, replacementTable: _, conversion: p, compoundRules: P, rules: l, flags: m };
    function ee(ae) {
      ae = ae.trim(), ae && ae.charCodeAt(0) !== 35 && x.push(ae);
    }
  }
  function a(i) {
    return new RegExp(i + "$");
  }
  function s(i) {
    return new RegExp("^" + i);
  }
  return no;
}
var ro, Da;
function ks() {
  if (Da) return ro;
  Da = 1, ro = u;
  function u(n, t) {
    for (var e = -1; ++e < t.length; ) n = n.replace(t[e][0], t[e][1]);
    return n;
  }
  return ro;
}
var oo, ya;
function Nr() {
  if (ya) return oo;
  ya = 1, oo = u;
  function u(n, t, e) {
    return e && t in n && e.indexOf(n[t]) > -1;
  }
  return oo;
}
var ao, wa;
function jc() {
  if (wa) return ao;
  wa = 1;
  var u = Nr();
  ao = n;
  function n(t, e) {
    var r = -1;
    if (t.data[e]) return !u(t.flags, "ONLYINCOMPOUND", t.data[e]);
    if (e.length >= t.flags.COMPOUNDMIN) {
      for (; ++r < t.compoundRules.length; ) if (t.compoundRules[r].test(e)) return true;
    }
    return false;
  }
  return ao;
}
var so, va;
function Oo() {
  if (va) return so;
  va = 1;
  var u = ks(), n = jc(), t = Nr();
  so = e;
  function e(o, a, s) {
    var i = a.trim(), l;
    if (!i) return null;
    if (i = u(i, o.conversion.in), n(o, i)) return !s && t(o.flags, "FORBIDDENWORD", o.data[i]) ? null : i;
    if (i.toUpperCase() === i) {
      if (l = i.charAt(0) + i.slice(1).toLowerCase(), r(o.flags, o.data[l], s)) return null;
      if (n(o, l)) return l;
    }
    if (l = i.toLowerCase(), l !== i) {
      if (r(o.flags, o.data[l], s)) return null;
      if (n(o, l)) return l;
    }
    return null;
  }
  function r(o, a, s) {
    return t(o, "KEEPCASE", a) || s || t(o, "FORBIDDENWORD", a);
  }
  return so;
}
var io, xa;
function Bc() {
  if (xa) return io;
  xa = 1;
  var u = Oo();
  io = n;
  function n(t) {
    return !!u(this, t);
  }
  return io;
}
var lo, Aa;
function Nc() {
  if (Aa) return lo;
  Aa = 1, lo = u;
  function u(t) {
    var e = n(t.charAt(0)), r = t.slice(1);
    return !r || (r = n(r), e === r) ? e : e === "u" && r === "l" ? "s" : null;
  }
  function n(t) {
    return t === t.toLowerCase() ? "l" : t === t.toUpperCase() ? "u" : null;
  }
  return lo;
}
var co, ka;
function $c() {
  if (ka) return co;
  ka = 1;
  var u = Nc(), n = ks(), t = Nr(), e = Oo();
  co = o;
  var r = [].push;
  function o(s) {
    var i = this, l = {}, h = [], m = {}, _, p, P = [], D, x, A, w, k, G, E, B, z, O, W, N, V, q, Y, ne, J, ee, ae, de, oe, fe, we;
    if (s = n(s.trim(), i.conversion.in), !s || i.correct(s)) return [];
    for (we = u(s), x = -1; ++x < i.replacementTable.length; ) for (p = i.replacementTable[x], A = s.indexOf(p[0]); A > -1; ) P.push(s.replace(p[0], p[1])), A = s.indexOf(p[0], A + 1);
    for (x = -1; ++x < s.length; ) for (B = s.charAt(x), O = s.slice(0, x), W = s.slice(x + 1), V = B.toLowerCase(), N = V !== B, l = {}, A = -1; ++A < i.flags.KEY.length; ) if (z = i.flags.KEY[A], w = z.indexOf(V), !(w < 0)) {
      for (G = -1; ++G < z.length; ) if (G !== w) {
        if (E = z.charAt(G), l[E]) continue;
        l[E] = true, N && (E = E.toUpperCase()), P.push(O + E + W);
      }
    }
    for (x = -1, J = s.charAt(0), D = [""], ee = 1, ae = 0; ++x < s.length; ) {
      for (B = J, J = s.charAt(x + 1), O = s.slice(0, x), p = B === J ? "" : B + B, A = -1, k = D.length; ++A < k; ) A <= ee && D.push(D[A] + p), D[A] += B;
      ++ae < 3 && (ee = D.length);
    }
    for (r.apply(P, D), D = [s], p = s.toLowerCase(), (s === p || we === null) && D.push(s.charAt(0).toUpperCase() + p.slice(1)), p = s.toUpperCase(), s !== p && D.push(p), _ = { state: {}, weighted: m, suggestions: h }, q = a(i, _, D, P), Y = 0, ee = Math.min(q.length, Math.pow(Math.max(15 - s.length, 3), 3)), de = Math.max(Math.pow(10 - s.length, 3), 1); !h.length && Y < ee; ) ne = Y + de, a(i, _, q.slice(Y, ne)), Y = ne;
    for (h.sort(ce), D = [], oe = [], x = -1; ++x < h.length; ) fe = n(h[x], i.conversion.out), p = fe.toLowerCase(), oe.indexOf(p) < 0 && (D.push(fe), oe.push(p));
    return D;
    function ce(Ce, Ee) {
      return Ge(Ce, Ee) || ge(Ce, Ee) || $e(Ce, Ee);
    }
    function Ge(Ce, Ee) {
      return m[Ce] === m[Ee] ? 0 : m[Ce] > m[Ee] ? -1 : 1;
    }
    function ge(Ce, Ee) {
      var Oe = u(Ce), Ke = u(Ee);
      return Oe === Ke ? 0 : Oe === we ? -1 : Ke === we ? 1 : void 0;
    }
    function $e(Ce, Ee) {
      return Ce.localeCompare(Ee);
    }
  }
  function a(s, i, l, h) {
    var m = s.flags.TRY, _ = s.data, p = s.flags, P = [], D = -1, x, A, w, k, G, E, B, z, O, W, N, V, q;
    if (h) for (; ++D < h.length; ) Y(h[D], true);
    for (D = -1; ++D < l.length; ) for (x = l[D], A = "", w = "", k = x.charAt(0), G = x, E = x.slice(1), B = k.toLowerCase() !== k, z = u(x), O = -1; ++O <= x.length; ) for (A += w, W = G, G = E, E = G.slice(1), w = k, k = x.charAt(O + 1), N = B, k && (B = k.toLowerCase() !== k), G && N !== B && (Y(A + ne(G)), Y(A + ne(k) + ne(w) + E)), Y(A + G), G && Y(A + k + w + E), q = -1; ++q < m.length; ) V = m[q], N && V !== V.toUpperCase() ? (z !== "s" && (Y(A + V + W), Y(A + V + G)), V = V.toUpperCase(), Y(A + V + W), Y(A + V + G)) : (Y(A + V + W), Y(A + V + G));
    return P;
    function Y(J, ee) {
      var ae = i.state[J], de;
      ae !== !!ae && (P.push(J), de = e(s, J), ae = de && !t(p, "NOSUGGEST", _[de]), i.state[J] = ae, ae && (i.weighted[J] = ee ? 10 : 0, i.suggestions.push(J))), ae && i.weighted[J]++;
    }
    function ne(J) {
      var ee = J.charAt(0);
      return (ee.toLowerCase() === ee ? ee.toUpperCase() : ee.toLowerCase()) + J.slice(1);
    }
  }
  return co;
}
var uo, Ea;
function Uc() {
  if (Ea) return uo;
  Ea = 1;
  var u = Oo(), n = Nr();
  uo = t;
  function t(e) {
    var r = this, o = u(r, e, true);
    return { correct: r.correct(e), forbidden: !!(o && n(r.flags, "FORBIDDENWORD", r.data[o])), warn: !!(o && n(r.flags, "WARN", r.data[o])) };
  }
  return uo;
}
var ho, Sa;
function zc() {
  if (Sa) return ho;
  Sa = 1, ho = u;
  function u(n, t, e, r) {
    for (var o = -1, a, s, i, l, h; ++o < t.entries.length; ) if (a = t.entries[o], l = a.continuation, h = -1, (!a.match || a.match.test(n)) && (s = a.remove ? n.replace(a.remove, "") : n, s = t.type === "SFX" ? s + a.add : a.add + s, r.push(s), l && l.length)) for (; ++h < l.length; ) i = e[l[h]], i && u(s, i, e, r);
    return r;
  }
  return ho;
}
var mo, Ca;
function Es() {
  if (Ca) return mo;
  Ca = 1;
  var u = zc();
  mo = r;
  var n = [].push, t = [];
  function e(o, a, s) {
    var i = o[a];
    a in o ? i === t ? o[a] = s.concat() : n.apply(i, s) : o[a] = s.concat();
  }
  function r(o, a, s, i) {
    var l = -1, h, m, _, p, P, D, x;
    for ((!("NEEDAFFIX" in i.flags) || s.indexOf(i.flags.NEEDAFFIX) < 0) && e(o, a, s); ++l < s.length; ) if (h = i.rules[s[l]], s[l] in i.compoundRuleCodes && i.compoundRuleCodes[s[l]].push(a), h) {
      for (D = u(a, h, i.rules, []), m = -1; ++m < D.length; ) if (D[m] in o || (o[D[m]] = t), h.combineable) {
        for (_ = l; ++_ < s.length; ) if (P = i.rules[s[_]], P && P.combineable && h.type !== P.type) for (x = u(D[m], P, i.rules, []), p = -1; ++p < x.length; ) x[p] in o || (o[x[p]] = t);
      }
    }
  }
  return mo;
}
var fo, Ma;
function Hc() {
  if (Ma) return fo;
  Ma = 1;
  var u = Es();
  fo = t;
  var n = [];
  function t(e, r) {
    var o = this;
    return u(o.data, e, o.data[r] || n, o), o;
  }
  return fo;
}
var _o, Ga;
function Wc() {
  if (Ga) return _o;
  Ga = 1, _o = u;
  function u(n) {
    var t = this;
    return delete t.data[n], t;
  }
  return _o;
}
var po, Ta;
function Vc() {
  if (Ta) return po;
  Ta = 1, po = u;
  function u() {
    return this.flags.WORDCHARS || null;
  }
  return po;
}
var Fo, Oa;
function Kc() {
  if (Oa) return Fo;
  Oa = 1;
  var u = As(), n = Es();
  Fo = e;
  var t = /\s/g;
  function e(o, a, s) {
    for (var i = o.toString("utf8"), l = i.indexOf(`
`) + 1, h = i.indexOf(`
`, l); h > -1; ) i.charCodeAt(l) !== 9 && r(i.slice(l, h), a, s), l = h + 1, h = i.indexOf(`
`, l);
    r(i.slice(l), a, s);
  }
  function r(o, a, s) {
    for (var i = o.indexOf("/"), l = o.indexOf("#"), h = "", m, _; i > -1 && o.charCodeAt(i - 1) === 92; ) o = o.slice(0, i - 1) + o.slice(i), i = o.indexOf("/", i);
    l > -1 ? i > -1 && i < l ? (m = o.slice(0, i), t.lastIndex = i + 1, _ = t.exec(o), h = o.slice(i + 1, _ ? _.index : void 0)) : m = o.slice(0, l) : i > -1 ? (m = o.slice(0, i), h = o.slice(i + 1)) : m = o, m = m.trim(), m && n(s, m, u(a.flags, h.trim()), a);
  }
  return Fo;
}
var go, Ra;
function Xc() {
  if (Ra) return go;
  Ra = 1;
  var u = Kc();
  go = n;
  function n(t) {
    var e = this, r = -1, o, a, s, i;
    for (u(t, e, e.data); ++r < e.compoundRules.length; ) {
      for (o = e.compoundRules[r], a = "", i = -1; ++i < o.length; ) s = o.charAt(i), a += e.compoundRuleCodes[s].length ? "(?:" + e.compoundRuleCodes[s].join("|") + ")" : s;
      e.compoundRules[r] = new RegExp(a, "i");
    }
    return e;
  }
  return go;
}
var bo, Ia;
function qc() {
  if (Ia) return bo;
  Ia = 1, bo = u;
  function u(n) {
    var t = this, e = n.toString("utf8").split(`
`), r = -1, o, a, s, i;
    for (t.flags.FORBIDDENWORD === void 0 && (t.flags.FORBIDDENWORD = false), i = t.flags.FORBIDDENWORD; ++r < e.length; ) o = e[r].trim(), o && (o = o.split("/"), s = o[0], a = s.charAt(0) === "*", a && (s = s.slice(1)), t.add(s, o[1]), a && t.data[s].push(i));
    return t;
  }
  return bo;
}
var Po, La;
function Yc() {
  if (La) return Po;
  La = 1;
  var u = Ic(), n = Lc();
  Po = e;
  var t = e.prototype;
  t.correct = Bc(), t.suggest = $c(), t.spell = Uc(), t.add = Hc(), t.remove = Wc(), t.wordCharacters = Vc(), t.dictionary = Xc(), t.personal = qc();
  function e(r, o) {
    var a = -1, s;
    if (!(this instanceof e)) return new e(r, o);
    if (typeof r == "string" || u(r) ? (typeof o == "string" || u(o)) && (s = [{ dic: o }]) : r && ("length" in r ? (s = r, r = r[0] && r[0].aff) : (r.dic && (s = [r]), r = r.aff)), !r) throw new Error("Missing `aff` in dictionary");
    if (r = n(r), this.data = /* @__PURE__ */ Object.create(null), this.compoundRuleCodes = r.compoundRuleCodes, this.replacementTable = r.replacementTable, this.conversion = r.conversion, this.compoundRules = r.compoundRules, this.rules = r.rules, this.flags = r.flags, s) for (; ++a < s.length; ) s[a].dic && this.dictionary(s[a].dic);
  }
  return Po;
}
var Jc = Yc();
const Zc = Rc(Jc);
async function Ss(u, n, t, e, r) {
  let o = To(t);
  for (const [s, i] of [...e].sort((l, h) => h[0] - l[0])) o = sc(o, s, i, r);
  const a = t.objs[0].margin.id;
  gt(u, n, a), ur(o).trim() && await tr(u, n, o, a);
}
const Qc = (u) => u.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function Ro(u, n) {
  const t = Qc(u);
  return new RegExp(n.wholeWord ? `(?<![\\p{L}\\p{N}\\p{M}])${t}(?![\\p{L}\\p{N}\\p{M}])` : t, "gu" + (n.matchCase ? "" : "i"));
}
const Ir = (u, n) => (u.match(new RegExp(n.source, n.flags)) || []).length, Do = (u) => `${u.text}|${Math.round(u.bounds.l)}|${Math.round(u.bounds.b)}`, eu = (u, n) => u.l < n.r && n.l < u.r && u.b < n.t && n.b < u.t;
function tu(u, n, t) {
  const e = Ro(n, t);
  let r = 0;
  for (let o = 0; o < u.doc.pageCount; o++) for (const a of Pn(u.doc.textObjects(o))) r += Ir(a.text, e);
  return r;
}
async function nu(u, n, t, e) {
  const r = Ro(n, e), o = u.doc;
  let a = 0, s = 0;
  const i = [];
  return await u.mutate(`Replace “${n}”`, { pages: "all" }, async () => {
    for (let l = 0; l < o.pageCount; l++) {
      const h = new Set(Pn(o.textObjects(l)).filter((_) => Ir(_.text, r)).map(Do));
      let m = h.size + 5;
      for (; h.size && m-- > 0; ) {
        const _ = Pn(o.textObjects(l)).find((p) => h.has(Do(p)));
        if (!_) break;
        h.delete(Do(_)), a += Ir(_.text, r), s++, _.block ? await Ss(o, l, _, [..._.text.matchAll(new RegExp(r.source, r.flags))].map((p) => [p.index, p.index + p[0].length]), t) : await ws(o, l, _, _.text.replace(new RegExp(r.source, r.flags), () => t)), i.includes(l) || i.push(l);
      }
    }
    if (!a) throw new Error("No matches to replace");
  }), { count: a, lines: s, pages: i.length };
}
async function Cs(u, n, t, e, r, o) {
  const a = Ro(e, o), s = u.doc, l = Pn(s.textObjects(n)).filter((x) => eu(x.bounds, t) && Ir(x.text, a))[0];
  if (!l) return false;
  if (l.block) {
    const x = To(l), A = ur(x), w = x.lh * x.size * Math.hypot(x.bm[0], x.bm[1]), k = Math.max(1, Math.round((l.bounds.t - l.bounds.b) / w)), G = Math.min(k - 1, Math.max(0, Math.floor((l.bounds.t - t.t) / w + 0.3))), E = (t.l - l.bounds.l) / Math.max(1, l.bounds.r - l.bounds.l), B = (G + E) / k * A.length, z = [...A.matchAll(new RegExp(a.source, a.flags))];
    if (!z.length) return false;
    const O = z.reduce((W, N) => Math.abs(N.index - B) < Math.abs(W.index - B) ? N : W);
    return await u.mutate(`Replace “${e}”`, { pages: [n] }, () => Ss(s, n, l, [[O.index, O.index + O[0].length]], r)), true;
  }
  const h = l.text, m = l.bounds, _ = (t.l - m.l) / Math.max(1, m.r - m.l), p = [...h.matchAll(new RegExp(a.source, a.flags))];
  if (!p.length) return false;
  const P = p.reduce((x, A) => Math.abs(A.index / Math.max(1, h.length) - _) < Math.abs(x.index / Math.max(1, h.length) - _) ? A : x), D = h.slice(0, P.index) + r + h.slice(P.index + P[0].length);
  return await u.mutate(`Replace “${e}”`, { pages: [n] }, () => ws(s, n, l, D)), true;
}
let br = null;
const Ms = "margin.spell.words", Gs = () => {
  try {
    return JSON.parse(localStorage.getItem(Ms) || "[]");
  } catch {
    return [];
  }
};
function ja() {
  return br ??= Promise.all([Cr("dict/en.aff"), Cr("dict/en.dic")]).then(([u, n]) => {
    const t = new TextDecoder(), e = Zc({ aff: t.decode(u), dic: t.decode(n) });
    for (const r of Gs()) e.add(r);
    return e;
  }), br.catch(() => {
    br = null;
  }), br;
}
class Lr {
  app;
  v;
  el = null;
  issues = [];
  at = 0;
  ignored = /* @__PURE__ */ new Set();
  busy = false;
  constructor(n, t) {
    this.app = n, this.v = t;
  }
  static candidate(n) {
    return n.length > 1 && (n.match(/[A-Z\u00C0-\u00DE]/g)?.length ?? 0) < 2 && !/[a-z].*[A-Z]/.test(n);
  }
  async open() {
    this.el || this.build(), this.el.hidden = false, this.status("Loading the English dictionary…"), this.render();
    let n;
    try {
      n = await ja(), this.sync = n;
    } catch (o) {
      this.status("The dictionary couldn’t be loaded: " + o.message);
      return;
    }
    this.busy = true, this.issues = [], this.at = 0;
    const t = /* @__PURE__ */ new Map(), e = (o) => {
      const a = o.replace(/’/g, "'");
      let s = t.get(a);
      return s == null && (s = !(n.correct(a) || n.correct(a.toLowerCase())), t.set(a, s)), s;
    }, r = this.app.doc.pageCount;
    for (let o = 0; o < r; o++) {
      if (!this.el || this.el.hidden) {
        this.busy = false;
        return;
      }
      this.status(`Checking page ${o + 1} of ${r}…`), o % 4 === 0 && await new Promise((a) => setTimeout(a, 0)), this.app.relieveMemory(o);
      try {
        for (const a of this.app.doc.pageWords(o, Lr.candidate)) !this.ignored.has(a.word.toLowerCase()) && e(a.word) && this.issues.push({ page: o, ...a });
      } catch {
      }
    }
    this.busy = false, this.render();
  }
  close() {
    this.el && (this.el.hidden = true), this.v.setHits([], -1);
  }
  build() {
    this.el = y("section", { class: "spell-panel", role: "dialog", "aria-label": "Spelling", hidden: true }), document.body.append(this.el), document.addEventListener("keydown", (n) => {
      if (n.key !== "Escape" || !this.el || this.el.hidden || document.querySelector(".modal, .ctxmenu")) return;
      const t = n.target;
      t.closest?.("input,textarea,[contenteditable]") && !this.el.contains(t) || (n.stopPropagation(), this.close());
    }, true);
  }
  status(n) {
    const t = this.el?.querySelector(".sp-status");
    t ? t.textContent = n : this.render(n);
  }
  render(n) {
    const t = this.el, e = this.issues[this.at], r = y("div", { class: "sp-head" }, y("h2", { text: "Spelling" }), y("span", { class: "hint", text: "English" }), y("button", { class: "iconbtn small", type: "button", "aria-label": "Close", title: "Close (Esc)", onclick: () => this.close() }, Ve("close"))), o = y("p", { class: "sp-status", text: n ?? (this.busy ? "" : this.issues.length ? `${this.at + 1} of ${this.issues.length} possible misspelling${this.issues.length === 1 ? "" : "s"}` : "No spelling problems found.") });
    if (t.replaceChildren(r, o), !e || this.busy) {
      this.v.setHits([], -1);
      return;
    }
    const a = y("p", { class: "sp-context" }), s = e.context.indexOf(e.word);
    s >= 0 ? a.append(e.context.slice(0, s), y("mark", { text: e.word }), e.context.slice(s + e.word.length)) : a.textContent = e.context;
    const i = this.suggest(e.word);
    t.append(y("div", { class: "sp-word" }, y("b", { text: e.word }), y("span", { class: "hint", text: ` page ${e.page + 1}` })), a, y("div", { class: "sp-sugg" }, ...i.length ? i.map((l) => y("button", { class: "chip", type: "button", title: `Replace with “${l}”`, onclick: () => this.replace(e, l) }, l)) : [y("span", { class: "hint", text: "No suggestions" })]), y("div", { class: "sp-actions" }, y("button", { class: "btn ghost small", type: "button", onclick: () => this.skip() }, "Ignore"), y("button", { class: "btn ghost small", type: "button", onclick: () => this.ignoreAll(e.word) }, "Ignore all"), y("button", { class: "btn ghost small", type: "button", onclick: () => this.learn(e.word) }, "Add to dictionary"), y("span", { class: "sp-nav" }, y("button", { class: "iconbtn small", type: "button", "aria-label": "Previous", title: "Previous", disabled: this.at === 0, onclick: () => {
      this.at--, this.render();
    } }, Ve("up")), y("button", { class: "iconbtn small", type: "button", "aria-label": "Next", title: "Next", disabled: this.at >= this.issues.length - 1, onclick: () => {
      this.at++, this.render();
    } }, Ve("down"))))), this.v.setHits([{ page: e.page, rects: e.rects }], 0), e.rects[0] && this.v.scrollToPage(e.page, e.rects[0]);
  }
  suggestCache = /* @__PURE__ */ new Map();
  suggest(n) {
    let t = this.suggestCache.get(n);
    if (t) return t;
    const e = this.sync;
    if (!e) return [];
    const r = /^[A-Z]/.test(n), o = n.toLowerCase(), a = (l) => r ? l[0].toUpperCase() + l.slice(1) : l, s = /* @__PURE__ */ new Set();
    for (let l = 0; l + 1 < o.length; l++) {
      const h = o.slice(0, l) + o[l + 1] + o[l] + o.slice(l + 2);
      e.correct(h) && s.add(a(h));
    }
    for (const l of [...e.suggest(o), ...r ? e.suggest(n) : []]) s.add(/^[A-Z]{2,}/.test(l) ? l : a(l));
    s.delete(n);
    const i = (l, h) => {
      l = l.toLowerCase(), h = h.toLowerCase();
      const m = [];
      for (let _ = 0; _ <= l.length; _++) {
        m[_] = [_];
        for (let p = 1; p <= h.length; p++) m[_][p] = _ ? 0 : p;
      }
      for (let _ = 1; _ <= l.length; _++) for (let p = 1; p <= h.length; p++) m[_][p] = Math.min(m[_ - 1][p] + 1, m[_][p - 1] + 1, m[_ - 1][p - 1] + (l[_ - 1] === h[p - 1] ? 0 : 1)), _ > 1 && p > 1 && l[_ - 1] === h[p - 2] && l[_ - 2] === h[p - 1] && (m[_][p] = Math.min(m[_][p], m[_ - 2][p - 2] + 1));
      return m[l.length][h.length];
    };
    return t = [...s].map((l, h) => ({ x: l, k: h, d: i(n, l) })).sort((l, h) => l.d - h.d || l.k - h.k).map((l) => l.x).slice(0, 5), this.suggestCache.set(n, t), t;
  }
  sync = null;
  skip() {
    this.issues.splice(this.at, 1), this.at >= this.issues.length && (this.at = Math.max(0, this.issues.length - 1)), this.render();
  }
  ignoreAll(n) {
    const t = n.toLowerCase();
    this.ignored.add(t), this.issues = this.issues.filter((e) => e.word.toLowerCase() !== t), this.at >= this.issues.length && (this.at = Math.max(0, this.issues.length - 1)), this.render();
  }
  learn(n) {
    try {
      const t = Gs();
      t.includes(n) || (t.push(n), localStorage.setItem(Ms, JSON.stringify(t)));
    } catch {
    }
    this.sync?.add(n), this.ignoreAll(n), H(`Added “${n}” to your dictionary (this browser)`);
  }
  async replace(n, t) {
    if (!await Cs(this.app, n.page, Jt(n.rects), n.word, t, { matchCase: true, wholeWord: true }).catch((h) => (H(h.message, "err"), false))) return H(`“${n.word}” couldn’t be replaced here (it may be part of an image or a locked text block)`, "warn", 5e3);
    const r = await ja(), o = this.app.doc.pageWords(n.page, Lr.candidate).filter((h) => !this.ignored.has(h.word.toLowerCase()) && !(r.correct(h.word) || r.correct(h.word.toLowerCase()))), a = this.issues.filter((h) => h.page !== n.page), s = a.filter((h) => h.page < n.page).length, i = n.rects[0], l = i ? o.filter((h) => h.rects[0] && (h.rects[0].t > i.t + 1 || Math.abs(h.rects[0].t - i.t) <= 1 && h.rects[0].l < i.l)).length : 0;
    this.issues = [...a.slice(0, s), ...o.map((h) => ({ page: n.page, ...h })), ...a.slice(s)], this.at = Math.min(s + l, Math.max(0, this.issues.length - 1)), this.render();
  }
}
const ru = "margin", Ln = "kv", Ts = "page-clip";
let Yn = null;
const Io = (() => {
  try {
    return new BroadcastChannel("margin-pages");
  } catch {
    return null;
  }
})();
function Os() {
  return new Promise((u) => {
    try {
      const n = indexedDB.open(ru, 1);
      n.onupgradeneeded = () => {
        n.result.objectStoreNames.contains(Ln) || n.result.createObjectStore(Ln);
      }, n.onsuccess = () => u(n.result), n.onerror = () => u(null), n.onblocked = () => u(null);
    } catch {
      u(null);
    }
  });
}
async function Rs(u, n) {
  const t = await Os();
  if (!t) return false;
  const e = await new Promise((r) => {
    try {
      const o = t.transaction(Ln, "readwrite");
      o.objectStore(Ln).put(n, u), o.oncomplete = () => r(true), o.onerror = () => r(false), o.onabort = () => r(false);
    } catch {
      r(false);
    }
  });
  return t.close(), e;
}
async function Is(u) {
  const n = await Os();
  if (!n) return;
  const t = await new Promise((e) => {
    try {
      const r = n.transaction(Ln, "readonly").objectStore(Ln).get(u);
      r.onsuccess = () => e(r.result || null), r.onerror = () => e(null);
    } catch {
      e(null);
    }
  });
  return n.close(), t;
}
async function ou(u) {
  Yn = u;
  const n = await Rs(Ts, u);
  return n && Io?.postMessage({ kind: "pages", id: u.id, pages: u.pages, from: u.from }), n;
}
async function Pr() {
  const u = await Is(Ts);
  return u === void 0 ? Yn : u && (!Yn || u.at >= Yn.at) ? u : Yn;
}
function au(u) {
  Io?.addEventListener("message", (n) => {
    n.data?.kind !== "objects" && u(n.data);
  });
}
const Ls = "obj-clip";
let Jn = null;
async function su(u) {
  Jn = u;
  const n = await Rs(Ls, u);
  return n && Io?.postMessage({ kind: "objects", id: u.id, count: u.count, from: u.from }), n;
}
async function Kn() {
  const u = await Is(Ls);
  return u === void 0 ? Jn : u && (!Jn || u.at >= Jn.at) ? u : Jn;
}
const iu = (u) => `[Margin: ${u.count} object${u.count === 1 ? "" : "s"} from ${u.from} · ${u.id}]`, lu = (u) => /^\[Margin: \d+ objects? from .* · ([a-z0-9]+)\]$/.exec(u.trim())?.[1] ?? null, cu = (u) => `[Margin: ${u.pages} page${u.pages === 1 ? "" : "s"} from ${u.from} · ${u.id}]`, uu = (u) => /^\[Margin: \d+ pages? from .* · ([a-z0-9]+)\]$/.exec(u.trim())?.[1] ?? null, yo = (u) => `rgb(${u[0]},${u[1]},${u[2]})`, Ba = 200;
class hu {
  app;
  v;
  open = null;
  onChange = () => {
  };
  constructor(n, t) {
    this.app = n, this.v = t;
  }
  style() {
    const n = this.app.settings;
    return { fontKey: n.textFont, size: n.ftSize, color: n.ftColor, fill: n.ftFill, border: n.ftBorder, borderWidth: 1 };
  }
  down(n, t, e) {
    if (this.open) {
      this.open.done(true);
      return;
    }
    const r = this.v.toPage(t, n), o = this.app.settings.ftCallout, a = this.v.zoom, s = (l) => {
      if (!o) return Math.abs(l.x - r.x) < 6 && Math.abs(l.y - r.y) < 6 ? { l: r.x, r: r.x + Ba, t: r.y, b: r.y - this.app.settings.ftSize * 2.2 } : { l: Math.min(r.x, l.x), r: Math.max(r.x, l.x), b: Math.min(r.y, l.y), t: Math.max(r.y, l.y) };
      const h = Ba * 0.8, m = this.app.settings.ftSize * 2.2, _ = l.x >= r.x ? l.x : l.x - h, p = l.y >= r.y ? l.y + m : l.y;
      return { l: _, r: _ + h, t: p, b: p - m };
    };
    let i = r;
    e(n, t, (l) => {
      i = l;
      const h = t.tf.box(s(l)), m = [pt("rect", { x: h.x, y: h.y, width: h.w, height: h.h, fill: "none", stroke: "var(--sel)", "stroke-dasharray": "4 3" })];
      if (o) {
        const [_, p] = t.tf.apply(r.x, r.y);
        m.push(pt("line", { x1: _, y1: p, x2: h.x + h.w / 2, y2: h.y + h.h / 2, stroke: "var(--sel)", "stroke-dasharray": "4 3" }));
      }
      t.svg.replaceChildren(...m);
    }, (l) => {
      if (i = l, o && Math.hypot(i.x - r.x, i.y - r.y) < 12 / a) {
        H("Drag from the point the callout should point at to where the box goes", "warn");
        return;
      }
      const h = s(i);
      this.edit(t, null, { box: h, tip: o ? r : void 0, text: "", style: this.style() });
    });
  }
  async edit(n, t, e) {
    this.open && this.open.done(true);
    const r = this.app.doc, o = e || (t != null ? r.readFreeText(n.index, t) : null);
    if (!o) return;
    const a = cr(o.style.fontKey, o.text || "ก");
    await $t(a).catch(() => {
    });
    const s = n.tf.box(o.box), i = this.v.zoom, l = o.style, h = l.border ? l.borderWidth : 0, m = y("textarea", { class: "ftedit", spellcheck: true, "aria-label": "Text box" });
    m.value = o.text, Object.assign(m.style, { left: s.x + "px", top: s.y + "px", width: s.w + "px", minHeight: s.h + "px", padding: (4 + h) * i + "px", fontFamily: Dr(a), fontSize: l.size * i + "px", lineHeight: "1.3", color: yo(l.color), background: l.fill ? yo(l.fill) : "rgba(255,255,255,.85)", borderColor: l.border ? yo(l.border) : "transparent", borderWidth: Math.max(1, h * i) + "px" });
    const _ = () => {
      m.style.height = "0px", m.style.height = Math.max(s.h, m.scrollHeight) + "px";
    };
    n.ov.append(m), _(), m.addEventListener("input", _), m.addEventListener("pointerdown", (x) => x.stopPropagation());
    let p = false;
    const P = async (x) => {
      if (p) return;
      p = true, this.open = null, m.remove(), this.onChange();
      const A = m.value.replace(/\r/g, "").replace(/\s+$/, "");
      if (!x || A === o.text && t != null) {
        this.app.emit({ pages: [n.index] });
        return;
      }
      const w = n.index;
      try {
        if (!A) {
          t != null ? await this.app.mutate("Delete text box", { pages: [w] }, () => r.deleteAnnot(w, t)) : this.app.emit({ pages: [w] });
          return;
        }
        const k = { ...o, text: A }, G = await ta(k), E = t == null && o.tip ? G : Math.max(G, o.box.t - o.box.b);
        k.box = { ...o.box, b: o.box.t - E }, await this.app.mutate(t == null ? o.tip ? "Callout" : "Text box" : "Edit text box", { pages: [w] }, async () => {
          const B = t ?? r.createFreeText(w, this.app.settings.author);
          await ko(r, w, B, k);
        });
      } catch (k) {
        H(k.message, "err");
      }
    };
    m.addEventListener("keydown", (x) => {
      x.stopPropagation(), x.key === "Escape" ? (x.preventDefault(), P(false)) : x.key === "Enter" && (x.metaKey || x.ctrlKey) && (x.preventDefault(), P(true));
    }), m.addEventListener("blur", () => setTimeout(() => {
      !p && document.activeElement !== m && P(true);
    }, 120)), this.open = { pv: n, el: m, done: P }, this.onChange();
    const D = () => {
      !m.isConnected || p || (m.focus({ preventScroll: true }), m.setSelectionRange(m.value.length, m.value.length));
    };
    D(), requestAnimationFrame(D);
  }
  async update(n, t, e, r) {
    const o = this.app.doc, a = o.readFreeText(n, t);
    if (!a) return;
    const s = e(structuredClone(a)), i = await ta(s);
    s.box.t - s.box.b < i && (s.box.b = s.box.t - i), await this.app.mutate(r, { pages: [n] }, () => ko(o, n, t, s)).catch((l) => H(l.message, "err"));
  }
}
function du(u) {
  const n = u.trim();
  return n ? /^[a-z][a-z0-9+.-]*:/i.test(n) ? n : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(n) ? "mailto:" + n : /^[^\s]+\.[^\s]{2,}/.test(n) ? "https://" + n : null : null;
}
class mu {
  app;
  v;
  cache = /* @__PURE__ */ new Map();
  constructor(n, t) {
    this.app = n, this.v = t, n.on(() => this.cache.clear());
  }
  of(n) {
    let t = this.cache.get(n);
    return t || (t = this.app.doc.links(n), this.cache.set(n, t)), t;
  }
  overlay(n, t) {
    for (const e of this.of(n.index)) {
      const r = n.tf.box(e.rect), o = e.uri ? e.uri : e.page != null && e.page >= 0 ? `Go to page ${e.page + 1}` : "Link", a = y("a", { class: "lbox" + (t ? " edit" : ""), "data-link": String(e.index), title: t ? `${o} — click to edit` : o, role: "link", "aria-label": o, style: { left: r.x + "px", top: r.y + "px", width: r.w + "px", height: r.h + "px" } });
      t || (a.addEventListener("pointerdown", (s) => s.stopPropagation()), a.addEventListener("click", (s) => {
        s.preventDefault(), this.follow(e);
      })), n.ov.prepend(a);
    }
  }
  follow(n) {
    if (n.uri) try {
      window.open(n.uri, "_blank", "noopener");
    } catch {
      H(n.uri);
    }
    else n.page != null && n.page >= 0 && n.page < this.app.doc.pageCount && this.v.scrollToPage(n.page);
  }
  down(n, t, e) {
    const r = n.target.closest(".lbox");
    if (r) {
      n.preventDefault();
      const s = this.of(t.index).find((i) => i.index === +r.dataset.link);
      s && this.editDialog(t.index, s);
      return;
    }
    const o = this.v.toPage(t, n), a = (s) => {
      const i = { l: Math.min(o.x, s.x), r: Math.max(o.x, s.x), b: Math.min(o.y, s.y), t: Math.max(o.y, s.y) };
      if (i.t - i.b < 10) {
        const l = Math.min(o.y, s.y) - 3, h = Math.max(o.y, s.y) + 3, m = this.app.doc.selectionRects(t.index, o, s).rects.filter((_) => _.b <= h && _.t >= l && _.r >= i.l - 2 && _.l <= i.r + 2);
        if (m.length) {
          const _ = Jt(m);
          return { l: _.l - 1, r: _.r + 1, b: _.b - 1, t: _.t + 1 };
        }
      }
      return i;
    };
    e(n, t, (s) => {
      const i = t.tf.box(a(s));
      t.svg.replaceChildren(pt("rect", { x: i.x, y: i.y, width: i.w, height: i.h, fill: "rgba(90,162,255,.12)", stroke: "var(--sel)", "stroke-dasharray": "4 3" }));
    }, (s) => {
      const i = a(s);
      i.r - i.l < 4 || i.t - i.b < 4 || this.editDialog(t.index, null, i);
    });
  }
  async editDialog(n, t, e) {
    const r = this.app.doc.pageCount, o = t ? t.uri == null && t.page != null : false, a = y("input", { class: "tinput", id: "link-url", value: t?.uri || "", placeholder: "https://example.com or name@example.com", autocomplete: "off" }), s = y("input", { class: "rnum", id: "link-page", type: "number", min: "1", max: String(r), value: String(t?.page != null && t.page >= 0 ? t.page + 1 : Math.min(r, n + 2)) }), i = (D, x, A) => y("label", { class: "hf-check" }, y("input", { type: "radio", name: "link-kind", value: D, checked: A }), x), l = y("div", { class: "stack link-dialog" }, i("uri", "Web address or email", !o), a, i("page", "A page in this document", o), y("label", { class: "rfield" }, y("span", { class: "rlabel", text: "Page" }), s, y("span", { class: "rlabel", text: `of ${r}` }))), h = () => {
      const D = l.querySelector("input[name=link-kind]:checked").value;
      a.disabled = D !== "uri", s.disabled = D !== "page";
    };
    l.addEventListener("change", h), h(), a.addEventListener("focus", () => {
      l.querySelector("input[value=uri]").checked = true, h();
    });
    const m = await nt({ title: t ? "Edit link" : "Add link", body: l, actions: [...t ? [{ id: "remove", label: "Remove link", danger: true }] : [], { id: "cancel", label: "Cancel" }, { id: "ok", label: t ? "Save" : "Add link", primary: true }] });
    if (m === "remove" && t) {
      await this.app.mutate("Remove link", { pages: [n] }, () => this.app.doc.deleteAnnot(n, t.index)).catch((D) => H(D.message, "err"));
      return;
    }
    if (m !== "ok") return;
    const _ = l.querySelector("input[name=link-kind]:checked").value;
    let p;
    if (_ === "uri") {
      const D = du(a.value);
      if (!D) {
        H("Enter a web address like example.com, or an email address", "warn");
        return;
      }
      p = { uri: D };
    } else {
      const D = Math.round(+s.value);
      if (!(D >= 1 && D <= r)) {
        H(`Pages go from 1 to ${r}`, "warn");
        return;
      }
      p = { page: D - 1 };
    }
    const P = t ? t.rect : e;
    await this.app.mutate(t ? "Edit link" : "Add link", { pages: [n] }, () => {
      t && this.app.doc.deleteAnnot(n, t.index), this.app.doc.addLink(n, P, p);
    }).catch((D) => H(D.message, "err"));
  }
}
const kr = [{ kind: "text", label: "Text", w: 180, h: 22, base: "Text" }, { kind: "multiline", label: "Multi-line", w: 240, h: 64, base: "Notes" }, { kind: "checkbox", label: "Checkbox", w: 14, h: 14, base: "Check" }, { kind: "radio", label: "Radio", w: 14, h: 14, base: "Choice" }, { kind: "dropdown", label: "Dropdown", w: 160, h: 22, base: "Dropdown" }, { kind: "list", label: "List", w: 160, h: 64, base: "List" }, { kind: "signature", label: "Signature", w: 180, h: 44, base: "Signature" }], Na = { [ye.TEXT]: "Text field", [ye.CHECKBOX]: "Checkbox", [ye.RADIO]: "Radio button", [ye.COMBO]: "Dropdown", [ye.LIST]: "List box", [ye.PUSHBUTTON]: "Button", [ye.SIGNATURE]: "Signature field" }, fu = (u, n) => u.normalize("NFKD").replace(/[^\x20-\x7e]/g, "").replace(/[^A-Za-z0-9 _.-]/g, "").trim().replace(/\s+/g, "_") || n;
class _u {
  app;
  v;
  constructor(n, t) {
    this.app = n, this.v = t;
  }
  allFields() {
    const n = [];
    for (let t = 0; t < this.app.doc.pageCount; t++) for (const e of this.app.doc.fields(t)) n.push({ ...e, page: t });
    return n;
  }
  uniqueName(n) {
    const t = new Set(this.allFields().map((r) => r.name));
    let e = 1;
    for (; t.has(n + e); ) e++;
    return n + e;
  }
  overlay(n) {
    for (const t of this.v.fieldsOf(n)) {
      const e = n.tf.box(t.rect);
      n.ov.append(y("div", { class: "fbox", "data-field": String(t.index), title: `${Na[t.type] || "Field"} “${t.name}” — click to edit`, style: { left: e.x + "px", top: e.y + "px", width: e.w + "px", height: e.h + "px" } }, y("span", { class: "fname-tag", text: t.name })));
    }
  }
  down(n, t, e) {
    const r = n.target.closest(".fbox");
    if (r) {
      n.preventDefault();
      const i = this.v.fieldsOf(t).find((l) => l.index === +r.dataset.field);
      i && this.editDialog(t.index, i);
      return;
    }
    const o = kr.find((i) => i.kind === this.app.settings.formKind) || kr[0], a = this.v.toPage(t, n), s = (i) => {
      if (Math.abs(i.x - a.x) < 6 && Math.abs(i.y - a.y) < 6) return { l: a.x, r: a.x + o.w, t: a.y, b: a.y - o.h };
      if (o.kind === "checkbox" || o.kind === "radio") {
        const l = Math.max(Math.abs(i.x - a.x), Math.abs(i.y - a.y));
        return { l: Math.min(a.x, a.x + Math.sign(i.x - a.x) * l), r: Math.max(a.x, a.x + Math.sign(i.x - a.x) * l), b: Math.min(a.y, a.y + Math.sign(i.y - a.y) * l), t: Math.max(a.y, a.y + Math.sign(i.y - a.y) * l) };
      }
      return { l: Math.min(a.x, i.x), r: Math.max(a.x, i.x), b: Math.min(a.y, i.y), t: Math.max(a.y, i.y) };
    };
    e(n, t, (i) => {
      const l = t.tf.box(s(i));
      t.svg.replaceChildren(pt("rect", { x: l.x, y: l.y, width: l.w, height: l.h, fill: "rgba(90,162,255,.12)", stroke: "var(--sel)", "stroke-dasharray": "4 3" }));
    }, (i) => {
      const l = s(i);
      l.r - l.l < 6 || l.t - l.b < 6 || this.newDialog(t.index, o.kind, l);
    });
  }
  async newDialog(n, t, e) {
    const r = kr.find((D) => D.kind === t), o = [...new Set(this.allFields().filter((D) => D.type === ye.RADIO).map((D) => D.name))], a = this.app.settings.formLastGroup && o.includes(this.app.settings.formLastGroup) ? this.app.settings.formLastGroup : "", s = y("input", { class: "tinput", id: "ff-name", value: t === "radio" ? a || this.uniqueName("Group") : this.uniqueName(r.base), autocomplete: "off", list: "ff-groups" }), i = [y("label", { class: "stack-field" }, y("span", { class: "rlabel", text: t === "radio" ? "Group (buttons with the same group name: only one can be chosen)" : "Field name" }), s)];
    t === "radio" && i.push(y("datalist", { id: "ff-groups" }, ...o.map((D) => y("option", { value: D }))));
    let l = null, h = null;
    if (t === "radio") {
      const D = this.allFields().filter((x) => x.type === ye.RADIO && x.name === s.value).length;
      l = y("input", { class: "tinput", id: "ff-value", value: `Choice${D + 1}`, autocomplete: "off" }), i.push(y("label", { class: "stack-field" }, y("span", { class: "rlabel", text: "This button’s value (letters and digits)" }), l));
    }
    if ((t === "dropdown" || t === "list") && (h = y("textarea", { class: "tinput ff-opts", id: "ff-opts", rows: 5, placeholder: "One option per line" }), h.value = `Option 1
Option 2
Option 3`, i.push(y("label", { class: "stack-field" }, y("span", { class: "rlabel", text: "Options, one per line" }), h))), await nt({ title: `New ${r.label.toLowerCase()} field`, body: y("div", { class: "stack" }, ...i), actions: [{ id: "cancel", label: "Cancel" }, { id: "ok", label: "Add field", primary: true }] }) !== "ok") return;
    const _ = s.value.trim() || this.uniqueName(r.base);
    if (t !== "radio" && this.allFields().some((D) => D.name === _)) {
      H(`A field named “${_}” already exists`, "warn");
      return;
    }
    const p = h ? h.value.split(`
`).map((D) => D.trim()).filter(Boolean) : void 0;
    if (h && !p.length) {
      H("Add at least one option", "warn");
      return;
    }
    const P = l ? fu(l.value, "Choice") : void 0;
    t === "radio" && (this.app.settings.formLastGroup = _, this.app.saveSettings()), await this.app.mutate(`Add ${r.label.toLowerCase()} field`, { pages: "all", structure: t === "radio" || t === "signature" }, () => {
      this.app.doc.createField(n, t, e, _, { options: p, onValue: P }), (t === "radio" || t === "signature") && this.app.patchNextCommit(za);
    }).catch((D) => H(D.message, "err"));
  }
  async editDialog(n, t) {
    const e = y("input", { class: "tinput", id: "ff-name", value: t.name, autocomplete: "off" }), r = [y("label", { class: "stack-field" }, y("span", { class: "rlabel", text: t.type === ye.RADIO ? "Group name" : "Field name" }), e)];
    let o = null;
    (t.type === ye.COMBO || t.type === ye.LIST) && (o = y("textarea", { class: "tinput ff-opts", rows: 5 }), o.value = t.options.map((_) => _.label).join(`
`), r.push(y("label", { class: "stack-field" }, y("span", { class: "rlabel", text: "Options, one per line" }), o))), r.push(y("p", { class: "modal-text", text: "Move or resize fields with Move & resize (A). Fill them in with Select (V)." }));
    const a = await nt({ title: `Edit ${(Na[t.type] || "field").toLowerCase()}`, body: y("div", { class: "stack" }, ...r), actions: [{ id: "delete", label: "Delete field", danger: true }, { id: "cancel", label: "Cancel" }, { id: "ok", label: "Save", primary: true }] }), s = this.app.doc;
    if (a === "delete") {
      await this.app.mutate("Delete field", { pages: [n] }, () => s.deleteAnnot(n, t.index)).catch((_) => H(_.message, "err"));
      return;
    }
    if (a !== "ok") return;
    const i = e.value.trim(), l = o ? o.value.split(`
`).map((_) => _.trim()).filter(Boolean) : null, h = i && i !== t.name, m = l && l.join(`
`) !== t.options.map((_) => _.label).join(`
`);
    if (!(!h && !m)) {
      if (h && t.type !== ye.RADIO && this.allFields().some((_) => _.name === i)) {
        H(`A field named “${i}” already exists`, "warn");
        return;
      }
      await this.app.mutate("Edit field", { pages: [n] }, () => {
        if (h && !s.setFieldName(n, t.index, i)) throw new Error("Could not rename the field");
        m && s.setFieldOptions(n, t.index, l);
      }).catch((_) => H(_.message, "err"));
    }
  }
}
const $a = (u) => {
  const n = /^D:(\d{4})(\d{2})(\d{2})(\d{2})?(\d{2})?/.exec(u || "");
  return n ? new Date(+n[1], +n[2] - 1, +n[3], +(n[4] || 0), +(n[5] || 0)).toLocaleString(void 0, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";
}, pu = (u) => u ? `rgb(${u[0]},${u[1]},${u[2]})` : "transparent";
class Fu {
  onEditFreeText = null;
  el;
  app;
  list;
  count;
  onGo = () => {
  };
  cache = [];
  replying = /* @__PURE__ */ new Set();
  constructor(n, t) {
    this.el = n, this.app = t, this.count = y("span", { class: "count" }), this.list = y("div", { class: "clist" }), n.append(y("div", { class: "panel-head" }, y("h2", { text: "Comments" }), this.count), this.list);
  }
  perPage = [];
  known = false;
  readPage(n) {
    this.app.relieveMemory(n);
    const t = this.app.doc.annots(n), e = (o) => {
      let a = o;
      for (let s = 0; a.irt != null && s < 20; s++) {
        const i = t.find((l) => l.index === a.irt);
        if (!i) break;
        a = i;
      }
      return a;
    }, r = [];
    for (const o of t) o.irt == null && Zn[o.subtype] && r.push({ page: n, a: o, replies: t.filter((a) => a.irt != null && e(a) === o).sort((a, s) => a.modified < s.modified ? -1 : 1) });
    this.perPage[n] = r;
  }
  refresh(n) {
    const t = this.app.doc, e = t.pageCount;
    if (!this.known || n && (n.pages === "all" || n.structure) || this.perPage.length !== e) {
      this.perPage = [];
      for (let o = 0; o < e; o++) this.readPage(o);
      this.known = true;
    } else if (n && Array.isArray(n.pages)) for (const o of n.pages) o >= 0 && o < e && this.readPage(o);
    if (this.cache = this.perPage.flat(), this.count.textContent = String(this.cache.length), this.list.replaceChildren(), !this.cache.length) {
      this.list.append(y("div", { class: "empty-note" }, y("p", { text: "No comments yet." }), y("p", { class: "hint", text: "Highlights, notes, drawings and shapes you add appear here, ready to reply to or edit." })));
      return;
    }
    let r = -1;
    for (const { page: o, a, replies: s } of this.cache) {
      o !== r && (this.list.append(y("div", { class: "cpage", text: `Page ${o + 1}` })), r = o);
      const i = this.app.selectedAnnot?.page === o && this.app.selectedAnnot.index === a.index, l = y("textarea", { class: "ctext", rows: 2, placeholder: "Add a comment", "aria-label": `Comment on ${Zn[a.subtype]}, page ${o + 1}` });
      l.value = a.contents;
      const h = () => {
        l.style.height = "auto", l.style.height = Math.min(220, l.scrollHeight + 2) + "px";
      };
      l.addEventListener("input", h), requestAnimationFrame(h), l.addEventListener("change", () => {
        if (a.subtype === 3 && this.onEditFreeText) {
          this.onEditFreeText(o, a.index, l.value);
          return;
        }
        this.app.mutate("Edit comment", { pages: [o] }, () => this.app.doc.setAnnotContents(o, a.index, l.value)).catch((w) => H(w.message, "err"));
      }), l.addEventListener("keydown", (w) => w.stopPropagation());
      const m = y("button", { class: "iconbtn small", type: "button", title: "Delete", "aria-label": "Delete annotation", onclick: (w) => {
        w.stopPropagation(), this.app.mutate("Delete annotation", { pages: [o] }, () => this.app.doc.deleteAnnot(o, a.index)).catch((k) => H(k.message, "err"));
      } }, Ve("trash")), _ = y("div", { class: "ccard" + (i ? " sel" : ""), "data-key": `${o}:${a.index}` }, y("div", { class: "chead", onclick: () => this.onGo(o, a) }, y("span", { class: "cdot", style: { background: pu(a.color) } }), y("span", { class: "ctype", text: a.subtype === 13 && a.contents === "Signature" ? "Signature" : Zn[a.subtype] }), y("span", { class: "cmeta", text: [a.author, $a(a.modified)].filter(Boolean).join(" · ") }), m), l);
      for (const w of s) {
        const k = y("textarea", { class: "ctext reply", rows: 1, "aria-label": `Reply by ${w.author}` });
        k.value = w.contents;
        const G = () => {
          k.style.height = "auto", k.style.height = Math.min(200, k.scrollHeight + 2) + "px";
        };
        k.addEventListener("input", G), requestAnimationFrame(G), k.addEventListener("keydown", (E) => E.stopPropagation()), k.addEventListener("change", () => this.app.mutate("Edit reply", { pages: [o] }, () => this.app.doc.setAnnotContents(o, w.index, k.value)).catch((E) => H(E.message, "err"))), _.append(y("div", { class: "creply" }, y("div", { class: "chead" }, y("span", { class: "ctype small", text: w.author || "Reply" }), y("span", { class: "cmeta", text: $a(w.modified) }), y("button", { class: "iconbtn small", type: "button", title: "Delete reply", "aria-label": "Delete reply", onclick: () => this.app.mutate("Delete reply", { pages: [o] }, () => this.app.doc.deleteAnnot(o, w.index)).catch((E) => H(E.message, "err")) }, Ve("trash"))), k));
      }
      const p = `${o}:${a.index}`, P = y("textarea", { class: "ctext", rows: 2, placeholder: "Write a reply", "aria-label": "Reply" });
      P.addEventListener("keydown", (w) => {
        w.stopPropagation(), w.key === "Enter" && (w.metaKey || w.ctrlKey) && D(), w.key === "Escape" && (this.replying.delete(p), this.refresh());
      });
      const D = () => {
        const w = P.value.trim();
        w && (this.replying.delete(p), this.app.mutate("Reply", { pages: [o] }, () => this.app.doc.addReply(o, a.index, w, this.app.settings.author)).catch((k) => H(k.message, "err")));
      }, x = y("div", { class: "creply-form", hidden: !this.replying.has(p) }, P, y("div", { class: "creply-actions" }, y("button", { class: "btn ghost small", type: "button", onclick: () => {
        this.replying.delete(p), x.hidden = true;
      } }, "Cancel"), y("button", { class: "btn primary small", type: "button", onclick: D }, "Reply"))), A = y("button", { class: "clink", type: "button", hidden: this.replying.has(p), onclick: () => {
        this.replying.add(p), x.hidden = false, A.hidden = true, P.focus();
      } }, s.length ? `Reply (${s.length} so far)` : "Reply");
      _.append(x, A), this.list.append(_);
    }
  }
  focus(n, t) {
    const e = this.list.querySelector(`[data-key="${n}:${t}"]`);
    e && (this.list.querySelectorAll(".ccard.sel").forEach((r) => r.classList.remove("sel")), e.classList.add("sel"), e.scrollIntoView({ block: "nearest", behavior: "smooth" }), e.querySelector("textarea").focus());
  }
  reply(n, t) {
    this.replying.add(`${n}:${t}`), this.refresh();
    const e = this.list.querySelector(`[data-key="${n}:${t}"]`);
    e && (e.scrollIntoView({ block: "nearest" }), e.querySelector(".creply-form textarea")?.focus());
  }
  markSelected() {
    const n = this.app.selectedAnnot;
    this.list.querySelectorAll(".ccard").forEach((t) => t.classList.toggle("sel", !!n && t.dataset.key === `${n.page}:${n.index}`));
  }
}
class gu {
  el;
  list;
  app;
  items = [];
  io;
  anchor = 0;
  onGo = () => {
  };
  onSelection = () => {
  };
  onMove = () => {
  };
  onInsertBlank = () => {
  };
  onInsertFrom = () => {
  };
  constructor(n, t) {
    this.el = n, this.app = t, this.list = y("div", { class: "thumb-list", role: "listbox", "aria-label": "Pages", "aria-multiselectable": "true" }), n.append(this.list), this.io = new IntersectionObserver((e) => {
      for (const r of e) r.isIntersecting && this.draw(+r.target.dataset.index);
    }, { root: this.list, rootMargin: "300px 0px" });
  }
  rebuild() {
    const n = this.list.scrollTop;
    this.io.disconnect(), this.list.replaceChildren(), this.items = [];
    const t = this.app.doc.pageCount;
    for (let e = 0; e < t; e++) {
      const { w: r, h: o } = this.app.doc.pageSize(e), a = y("canvas", { class: "tcanvas" }), s = 112, i = Math.round(s * (o / r));
      a.style.width = s + "px", a.style.height = i + "px";
      const l = y("div", { class: "thumb", role: "option", tabindex: "0", draggable: "true", "data-index": String(e), "aria-label": `Page ${e + 1}` }, y("div", { class: "tframe" }, a), y("span", { class: "tlabel", text: String(e + 1) }));
      l.addEventListener("click", (h) => this.click(e, h)), l.addEventListener("keydown", (h) => {
        (h.key === "Enter" || h.key === " ") && (h.preventDefault(), this.click(e, h));
      }), this.dnd(l, e), this.list.append(this.gap(e, t), l), this.items.push({ wrap: l, canvas: a, dirty: true }), this.io.observe(l);
    }
    this.list.append(this.gap(t, t)), this.list.scrollTop = n, this.mark();
  }
  gap(n, t) {
    const e = n === 0 ? "before page 1" : n === t ? `after page ${t}` : `between pages ${n} and ${n + 1}`, r = (m, _) => y("button", { class: "gap-item", type: "button", role: "menuitem", text: m, onclick: (p) => {
      p.stopPropagation(), l(), _();
    } }), o = y("div", { class: "gap-menu", role: "menu", hidden: true }, r("Blank page", () => this.onInsertBlank(n)), r("Pages from a PDF…", () => this.onInsertFrom(n))), a = y("button", { class: "gap-plus", type: "button", "aria-haspopup": "menu", "aria-expanded": "false", "aria-label": `Insert ${e}`, title: `Insert ${e}` }, Ve("plus")), s = (m) => {
      h.contains(m.target) || l();
    }, i = (m) => {
      m.key === "Escape" && (l(), a.focus());
    }, l = () => {
      o.hidden = true, h.classList.remove("open"), a.setAttribute("aria-expanded", "false"), document.removeEventListener("pointerdown", s, true), document.removeEventListener("keydown", i, true);
    };
    a.addEventListener("click", (m) => {
      if (m.stopPropagation(), !o.hidden) return l();
      this.list.querySelectorAll(".tgap.open .gap-plus").forEach((_) => _ !== a && _.click()), o.hidden = false, h.classList.add("open"), a.setAttribute("aria-expanded", "true"), document.addEventListener("pointerdown", s, true), document.addEventListener("keydown", i, true), o.firstElementChild.focus();
    });
    const h = y("div", { class: "tgap" + (n === t ? " end" : ""), "data-at": String(n) }, y("span", { class: "gap-line", "aria-hidden": "true" }), a, o);
    return h.addEventListener("dragover", (m) => {
      m.dataTransfer?.types.includes("Files") && (m.preventDefault(), m.stopPropagation(), h.classList.add("drop"));
    }), h.addEventListener("dragleave", () => h.classList.remove("drop")), h.addEventListener("drop", (m) => {
      h.classList.remove("drop");
      const _ = [...m.dataTransfer?.files || []].filter((p) => /\.pdf$/i.test(p.name) || p.type === "application/pdf");
      _.length && (m.preventDefault(), m.stopPropagation(), this.onInsertFrom(n, _));
    }), h;
  }
  invalidate(n) {
    const t = n === "all" ? this.items.map((e, r) => r) : n;
    for (const e of t) {
      const r = this.items[e];
      if (!r) continue;
      r.dirty = true;
      const o = r.wrap.getBoundingClientRect(), a = this.list.getBoundingClientRect();
      o.bottom > a.top - 300 && o.top < a.bottom + 300 && this.draw(e);
    }
  }
  draw(n) {
    const t = this.items[n];
    if (!t || !t.dirty) return;
    t.dirty = false;
    const { w: e, h: r } = this.app.doc.pageSize(n), a = 112 * Math.min(2, devicePixelRatio || 1), s = Math.round(a * (r / e));
    this.app.relieveMemory(n);
    const i = this.app.doc.render(n, a, s);
    t.canvas.width = i.width, t.canvas.height = i.height, t.canvas.getContext("2d").putImageData(i, 0, 0), t.canvas.style.height = Math.round(112 * (r / e)) + "px";
  }
  click(n, t) {
    const e = this.app.selectedPages;
    if (t.shiftKey) {
      const [r, o] = [Math.min(this.anchor, n), Math.max(this.anchor, n)];
      for (let a = r; a <= o; a++) e.add(a);
    } else t.metaKey || t.ctrlKey ? (e.has(n) ? e.delete(n) : e.add(n), this.anchor = n) : (e.clear(), e.add(n), this.anchor = n, this.onGo(n));
    this.mark(), this.onSelection();
  }
  mark() {
    this.items.forEach((n, t) => {
      n.wrap.classList.toggle("sel", this.app.selectedPages.has(t)), n.wrap.classList.toggle("cur", this.app.currentPage === t), n.wrap.setAttribute("aria-selected", String(this.app.selectedPages.has(t)));
    });
  }
  follow(n) {
    this.mark();
    const t = this.items[n];
    if (!t) return;
    const e = t.wrap.getBoundingClientRect(), r = this.list.getBoundingClientRect();
    (e.top < r.top || e.bottom > r.bottom) && t.wrap.scrollIntoView({ block: "nearest" });
  }
  dnd(n, t) {
    n.addEventListener("dragstart", (e) => {
      this.app.selectedPages.has(t) || (this.app.selectedPages.clear(), this.app.selectedPages.add(t), this.mark(), this.onSelection()), e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", "margin-pages"), n.classList.add("dragging");
    }), n.addEventListener("dragend", () => {
      n.classList.remove("dragging"), this.list.querySelectorAll(".drop-before,.drop-after").forEach((e) => e.classList.remove("drop-before", "drop-after"));
    }), n.addEventListener("dragover", (e) => {
      if (e.dataTransfer?.types.includes("Files")) return;
      e.preventDefault();
      const r = n.getBoundingClientRect(), o = e.clientY > r.top + r.height / 2;
      n.classList.toggle("drop-after", o), n.classList.toggle("drop-before", !o);
    }), n.addEventListener("dragleave", () => n.classList.remove("drop-before", "drop-after")), n.addEventListener("drop", (e) => {
      if (e.dataTransfer?.types.includes("Files")) return;
      e.preventDefault(), e.stopPropagation();
      const r = n.classList.contains("drop-after");
      n.classList.remove("drop-before", "drop-after");
      const o = [...this.app.selectedPages].sort((i, l) => i - l), a = t + (r ? 1 : 0), s = a - o.filter((i) => i < a).length;
      o.length && !(o.length === 1 && s === o[0]) && this.onMove(o, s);
    });
  }
}
function bu(u) {
  const n = (t, e, r) => y("button", { class: "iconbtn", type: "button", title: r, "aria-label": r, "data-act": t, onclick: () => u(t) }, Ve(e));
  return y("div", { class: "page-actions" }, n("rotl", "rotl", "Rotate left"), n("rotr", "rotr", "Rotate right"), n("insert", "plus", "Insert blank page after"), n("merge", "merge", "Insert pages from other PDFs"), n("copy", "copy", "Copy selected pages (Ctrl+C)"), n("paste", "paste", "Paste copied pages after the selected page (Ctrl+V)"), n("extract", "extract", "Extract or split pages"), n("delete", "trash", "Delete selected pages"));
}
const Pu = [{ version: "2.24.0", date: "2026-11-17", notes: ["Rectangles and ellipses: pick any outline or fill colour with the new custom colour swatch (rainbow), turn the outline or the fill off with None, and set transparency with an opacity slider. Select a shape to get these in the tool bar; they are also in its right-click menu (now with 10% opacity).", "The Rectangle and Ellipse tools take the same choices, so new shapes can start filled, without an outline, or see-through.", "Lines, arrows, drawings and highlights also get the custom colour swatch and the opacity slider when selected."] }, { version: "2.23.2", date: "2026-10-18", notes: ["Fixed on phones and tablets: dragging a rectangle or other annotation with Select could make it vanish. The browser treated the drag as a scroll and cancelled it, and Margin moved the annotation to where the cancelled touch reported (often off the page). A finger on an annotation now drags it, a finger anywhere else still scrolls, and a drag the browser cancels leaves things where they were."] }, { version: "2.23.1", date: "2026-10-09", notes: ["Fixed: Duplicate, Copy and Cut in the right-click menu (and Ctrl+D, Ctrl+C, Ctrl+X) did nothing with Select on an arrow, shape or other annotation drawn after you had used Move & resize. Select now always works from the page as it is."] }, { version: "2.23.0", date: "2026-10-09", notes: ["Copy, cut and paste objects: select annotations or pictures (with Select, or several at once in Move & resize) and press Ctrl+C or Ctrl+X, then Ctrl+V on any page, in another PDF, or in another Margin window. Shapes, arrows, drawings, notes, text boxes, stamps, signatures and pictures keep their look, comment text and layout relative to each other.", "Pasting again on the same page steps each copy down and to the right; on another page it lands in the same spot, kept inside the page. Right-click empty page space for Paste here to put it where you clicked. Cut, Copy and Paste are also in the right-click menus; Ctrl+V pastes whichever you copied last, pages or objects (in the sidebar it always pastes pages).", "Page text and links can’t be copied this way yet, and copying respects a protected PDF’s permissions."] }, { version: "2.22.0", date: "2026-10-09", notes: ["Right-click menus now fit each kind of object. Rectangles and ellipses: outline and fill color, line width, solid or dashed, opacity. Lines and arrows: color, width, dashes, arrowheads at either or both ends, open or filled heads, reverse direction, opacity. Drawings: color, width, dashes, opacity. Highlights and other markup: color and opacity. Text boxes: text color, fill, border and size.", "Duplicate (Ctrl+D) copies a shape, line, drawing, note, text box, stamp or signature, or a picture in Move & resize, a little down and to the right. Bring to front and Send to back are in the annotation menu too.", "Move & resize has its own right-click menu: align to the page or to each other, distribute, match size, stacking order, duplicate and delete for one or several objects; images add rotate, flip, crop, replace and Save image…. Right-click empty page space to add a note or text box right there, copy, rotate, insert or delete the page, or select all objects."] }, { version: "2.21.0", date: "2026-10-09", notes: ["Select several objects in Move & resize: Shift- or Ctrl-click to add or remove one, drag a box across empty space to select what’s inside, or Ctrl+A for the whole page. Move them together (snapping to the page and other objects), nudge them with the arrow keys, or delete them in one step.", "Align (left, centre, right, top, middle, bottom; one object aligns to the page), distribute evenly across or down, and match width, height or size to the object you clicked last. Text, images, drawings and annotations can be mixed.", "Stacking order: bring to front or forward, send backward or to back (Ctrl+] and Ctrl+[, with Shift for all the way). Annotations stack among annotations, above the page’s content."] }, { version: "2.20.0", date: "2026-10-09", notes: ["Replace pages: right-click selected pages (or More › Replace pages…), pick a PDF and which of its pages to use, and they take the place of the old ones in one undoable step. The counts don’t have to match; password-protected PDFs ask for their password.", "Bookmarks that pointed at the replaced pages now point at the new ones, and form fields on the new pages keep working. Also: a right-click menu no longer closes by itself when the list was still scrolling."] }, { version: "2.19.0", date: "2026-10-09", notes: ["Check spelling (More menu or F7): scans the document’s English text and steps through possible misspellings, highlighted on the page, with suggestions. Click a suggestion to fix it in place, or Ignore, Ignore all, or Add to dictionary (kept in this browser). Acronyms and words like iPhone are skipped; Thai text is left alone.", "Spelling is also checked as you type when editing text, in text boxes, comments and form fields, using your browser’s own dictionary."] }, { version: "2.18.0", date: "2026-10-09", notes: ["Compress (More menu): shrinks the file by downsampling and re-encoding images that are sharper than needed, with three presets (high quality 200 dpi, balanced 150 dpi, smallest 100 dpi), then rewrites the file without unused objects. Text and drawings are untouched.", "Shows the size before and after; undoable. Images with transparency keep it, images that wouldn’t get smaller are left alone, and an image used on several pages is kept as one shared copy."] }, { version: "2.17.0", date: "2026-10-09", notes: ["Export pages as images: PNG or JPEG (with a quality setting) at 72, 150, 300 or 600 dpi, for all, current, selected or a range of pages, with or without comments. One page saves as an image; several save together as a .zip.", "New More menu (⋯) in the top bar gathers the document tools: print, export as images, password protection, watermark, header & footer, flatten, and inserting or extracting pages. On phones it’s the way to reach them. Export as images is also in the page right-click menu."] }, { version: "2.16.0", date: "2026-10-09", notes: ["Bookmarks: a new Bookmarks tab in the left sidebar shows the PDF’s outline as a tree. Click one to go there; nested bookmarks expand and collapse.", "Add a bookmark for what’s on screen (named after the page’s title text, ready to rename), rename it (double-click or F2), point it at the current view, move it up or down, indent or outdent it (right-click menu or Alt+arrows), or delete it. Changes are saved in the PDF and can be undone."] }, { version: "2.15.0", date: "2026-10-09", notes: ["Print (printer button or Ctrl+P): all pages, the current page, the selected pages or a range, with or without comments and markup, at standard or high quality. Pages print exactly as they look on screen, Thai text included; landscape pages fit the paper.", "If the browser can’t print from here, Margin says so; save the PDF and print it from your PDF viewer instead. Printing respects a protected PDF’s permissions."] }, { version: "2.14.0", date: "2026-10-09", notes: ["Right-click an annotation on the page (with Select) for a menu: edit or add its comment, reply, copy the comment text, change its color, move & resize it, or delete it. Text boxes offer Edit text.", "Right-click a link to open it (or go to its page), copy its address, edit it, or remove it. Also opens with a long press on touch screens, or Shift+F10 / the Menu key on the selected annotation."] }, { version: "2.13.0", date: "2026-10-09", notes: ["Right-click a page in the sidebar for a menu: copy, paste after or before, rotate, insert a blank page or pages from a PDF, extract, delete, and go to the page. It acts on all selected pages when you right-click inside a selection.", "Also opens with a long press on touch screens, and with Shift+F10 or the Menu key on a focused page (arrow keys to move, Esc to close). Delete now removes the focused page’s selection from the sidebar too. Items a protected PDF doesn’t allow are greyed out."] }, { version: "2.12.0", date: "2026-10-09", notes: ["Copy and paste pages, including between Margin windows: select pages in the sidebar and press Ctrl+C (or the new Copy button), then Ctrl+V (or Paste) in this or another Margin window to insert them after the selected page. Undo removes them in one step.", "Pasted pages keep their comments, markup and working form fields; field names already in use get a _2 suffix. Copying respects a protected PDF’s permissions."] }, { version: "2.11.0", date: "2026-10-09", notes: ["Password protection (lock button in the top bar): require a password to open the PDF, and/or limit printing, copying, commenting and editing with a separate permissions password. Files are encrypted with AES-256; replacing or removing protection is undoable.", "Protected PDFs open with their password (including Thai passwords), stay protected when saved, and their limits are honored: changes they don’t allow are blocked until you unlock them with the permissions password.", "Inserting pages from a password-protected PDF now asks for its password instead of refusing."] }, { version: "2.10.1", date: "2026-10-09", notes: ["Faster undo and redo on large files: Margin now refreshes only the pages the edit touched, instead of re-reading every page for the comments list. On a 2.6 GB file, undoing a one-page edit takes about half a second instead of 2.5 seconds.", "Undoing a change to page order (inserting, deleting, moving or merging pages) still refreshes everything, since page numbers shift."] }, { version: "2.10.0", date: "2026-10-09", notes: ["Much larger files: Margin now opens and edits PDFs up to 4 GB (tested at 2.6 GB), up from about 500 MB. The PDF engine reads the file in pieces as it needs them instead of keeping its own copy, and it lets go of pages you’ve scrolled past.", "Edits and undo stay quick on big files: each edit is added to the file as a small update (usually a few KB), and undo just steps back to an earlier point, without copying anything. On a 900 MB file an edit takes about a third of a second and undo about a quarter.", "Files over 600 MB are saved the way Acrobat’s Save does: the original with your changes added at the end. Smaller files are still fully rewritten. Redactions in a file over 600 MB can’t be saved, since removing the content needs a full rewrite; extract the pages first."] }, { version: "2.9.1", date: "2026-10-09", notes: ["Faster edits on large files: undo steps now store only what changed (usually a few KB) instead of a full copy of the file. Each edit on a 100 MB file takes about half a second instead of over a second, and 40 undo steps no longer risk running the tab out of memory.", "The first edit after opening a large file takes a little longer while Margin prepares it. Undo history is also capped by memory, dropping the oldest steps first.", "Files too large for the browser’s PDF engine now say so instead of showing “Aborted”."] }, { version: "2.9.0", date: "2026-10-08", notes: ["Signature fields: the Form field tool has a new Signature type. It saves as a real PDF signature field, so Acrobat and other apps offer to sign it, digital certificates included.", "In Margin, click Sign here on an empty signature field to put your drawn signature in it, fitted to the box. Signature fields survive moving, resizing, extracting and inserting pages."] }, { version: "2.8.0", date: "2026-10-08", notes: ["Extracted and inserted pages keep working form fields: names, options, typed values, ticks and radio groups carry over, so the fields stay fillable in the new file.", "When inserted fields clash with names already in the document, they get a _2 suffix so they stay independent."] }, { version: "2.7.0", date: "2026-10-08", notes: ["Font and size per selection: select words while editing and pick a font or size to change just those words; with nothing selected, the font and size apply to the whole block.", "Lines with larger text get taller automatically, and the bar shows the font and size of the selected words."] }, { version: "2.6.0", date: "2026-10-08", notes: ["Replies on comments: every comment in the panel has a Reply link; replies show as a thread under it, can be edited or deleted, and are saved the standard way (Acrobat and other viewers show them as replies).", "Deleting a comment removes its replies too. Replies stay off the page itself."] }, { version: "2.5.0", date: "2026-10-08", notes: ["Image tools in Move & resize: select a picture to rotate it left or right, flip it horizontally or vertically, crop it, or replace it with another file.", "Cropping trims the picture itself (the cut part leaves the file) and works on rotated pictures; Replace fits the new picture upright in the old one’s box. Rotate and flip also work on vector graphics."] }, { version: "2.4.0", date: "2026-10-08", notes: ["Bulleted and numbered lists in text blocks: use the new list buttons while editing. Wrapped list items line up under their text, numbering counts automatically, and lists survive re-editing."] }, { version: "2.3.0", date: "2026-10-08", notes: ["New Form field tool (F): add text fields, multi-line text, checkboxes, radio buttons, dropdowns and list boxes. Drag a box or click; name the field and, for choices, list the options.", "Radio buttons with the same group name work together, each with its own value. Click a field with the tool to rename it, change its options or delete it; move and resize fields in Move & resize.", "The tool bar on the left now scrolls when there are more tools than fit, on desktop and on phones."] }, { version: "2.2.0", date: "2026-10-08", notes: ["New Redact tool (X): sweep across text or drag over an area to mark it, or mark every match of a word. Marks show as red outlines and nothing is removed until you apply.", "Apply removes the text, image pixels and drawings under the marks from the file (not just covered), plus comments and form fields mostly inside them, then covers the areas in black, white or nothing."] }, { version: "2.1.0", date: "2026-10-08", notes: ["Flatten (top bar): draws comments, markup, shapes, stamps, text boxes and filled-in form fields into the page, so they look the same everywhere and can no longer be changed. Choose comments, form fields or both; links stay clickable; undo works until you close the file."] }, { version: "2.0.0", date: "2026-10-08", notes: ["Mixed styles in one text block: select words and make them bold, italic, underlined, struck through or a different colour (Ctrl+B / I / U work too). Thai selections keep vowels and tone marks with their consonant.", "Paragraph reflow: Edit text now opens a whole paragraph of an existing PDF, and the text re-wraps as you edit. It uses the closest built-in font; a single line edited without style changes keeps its original font.", "Add text: drag across to set a width and the text wraps to it. Justify joins left, centre and right.", "In Move & resize, the side handles of wrapped text change its width and the text reflows; corners still scale it.", "Find & replace keeps the styles inside rich text blocks."] }, { version: "1.16.0", date: "2026-10-08", notes: ["New Link tool (G): sweep across text (it snaps to the words) or drag a box, then link to a web address, an email, or a page in this document. Click a link with the tool to edit or remove it.", "With Select, clicking a link follows it: pages scroll into view, web links open in a new tab. Links can be moved and resized in Move & resize."] }, { version: "1.15.0", date: "2026-10-08", notes: ["Find & replace (Ctrl+H, or the arrows button in the search box): replace the current match or every match, with Match case and Whole words. Thai works.", "Each changed line keeps its font, size, colour and position, like Edit text. Matches that cross a line break are skipped."] }, { version: "1.14.0", date: "2026-10-08", notes: ["New Watermark & background (top bar): text (Thai works) or an image, with opacity, angle, size, over or behind the content, on all pages or a range, with a live preview.", "Optional page background colour. Applying again replaces the old watermark; Remove takes it out."] }, { version: "1.13.0", date: "2026-10-08", notes: ["New Stamp tool (P): Approved, Rejected, Draft, Final, Confidential, For comment, Received, Paid, Void, Thai stamps (สำเนาถูกต้อง, อนุมัติ, ด่วน, ลับ) or your own text and colour.", "Optionally adds your name and the date and time under the stamp. Resize it from a corner in Move & resize."] }, { version: "1.12.0", date: "2026-10-08", notes: ["New Text box & callout tool (B): drag a box and type, or switch to Callout, press on what to point at and drag to where the box goes. Text wraps by word, Thai included.", "Choose font, size, text colour, fill and border. Double-click a text box with Select to edit it, or restyle it from the tool bar.", "In Move & resize, resizing a text box re-wraps its text; a callout keeps pointing at its target, and its arrow tip has its own handle."] }, { version: "1.11.0", date: "2026-10-08", notes: ["New Line & arrow tool (L): plain line, arrow or double arrow, in any colour and width. Hold Shift for 45° steps.", "In Move & resize, drag a line by its stroke, or drag either end to re-aim it."] }, { version: "1.10.0", date: "2026-10-08", notes: ["Extract pages now takes a page range (like 1-3, 5, 8-) and can split into one PDF per page or a PDF every N pages; several files download together as a .zip.", "Optionally remove the extracted pages from the document afterwards (undoable).", "Fixed: extracting or inserting pages that contain form fields could produce a file other viewers flagged as damaged. Those fields now keep their look but are no longer fillable in the extracted copy."] }, { version: "1.9.0", date: "2026-10-08", notes: ["New Crop pages tool (C): drag a rectangle, adjust its edges, then crop this page, the selected pages or every page.", "Uncrop restores a page to its full size; cropping only hides content, so nothing is lost."] }, { version: "1.8.0", date: "2026-10-08", notes: ["New Image tool (I): click to place a picture at its natural size, or drag a box to size it. It then opens in Move & resize.", "Paste an image with Ctrl+V, or drop image files onto a page.", "Images become part of the page, so they look the same in every PDF viewer. Photos stay JPEG and large ones are scaled to 300 dpi to keep files small."] }, { version: "1.7.0", date: "2026-10-08", notes: ["Picking the Signature tool asks which saved signature to place or lets you draw a new one.", "Keep up to six signatures, switch between them in the tool bar, and remove ones you no longer want."] }, { version: "1.6.2", date: "2026-10-08", notes: ["Fixed: a placed signature faded out of its box when dragged; moving and resizing signatures now keeps the image in place."] }, { version: "1.6.1", date: "2026-10-08", notes: ["Version number in the status bar, with this list of changes."] }, { version: "1.6.0", date: "2026-10-08", notes: ["Move & resize tool (A): drag text, images and annotations, resize from handles, snap guides, arrow-key nudging."] }, { version: "1.5.1", date: "2026-10-08", notes: ["Undo, redo and page operations keep your place instead of jumping to page 1."] }, { version: "1.5.0", date: "2026-10-08", notes: ["Bold, italic, underline and strikethrough, alignment and line spacing for added and edited text.", "Real bold and italic font files for Sarabun, Kanit, Prompt, Bai Jamjuree, Chakra Petch and Poppins."] }, { version: "1.4.2", date: "2026-10-08", notes: ["The insert slot between pages is a single + that opens a menu."] }, { version: "1.4.1", date: "2026-10-08", notes: ["More space between page thumbnails."] }, { version: "1.4.0", date: "2026-10-08", notes: ["Insert a blank page or pages from another PDF at any position in the page sidebar; drop PDFs between pages."] }, { version: "1.3.0", date: "2026-10-08", notes: ["Live preview in the Header & footer dialog."] }, { version: "1.2.0", date: "2026-10-08", notes: ["Images such as logos in header and footer positions."] }, { version: "1.1.0", date: "2026-10-08", notes: ["Header & footer with page-number tokens, page ranges and Thai digits."] }, { version: "1.0.2", date: "2026-10-08", notes: ["The tool bar no longer scrolls sideways."] }, { version: "1.0.1", date: "2026-10-08", notes: ['The PDF engine and fonts are built into the page, fixing "Failed to fetch" on start.'] }, { version: "1.0.0", date: "2026-10-08", notes: ["Rebuilt on PDFium with HarfBuzz Thai shaping: edit existing text, real annotations, forms, signatures and page management."] }], Xn = "2.24.0", lt = { highlight: [[246, 214, 74, 255], [134, 222, 140, 255], [120, 196, 246, 255], [246, 150, 198, 255], [250, 172, 92, 255]], pen: [[24, 26, 33, 255], [214, 69, 52, 255], [37, 99, 235, 255], [22, 140, 82, 255], [124, 77, 219, 255]] };
let Du = null;
function yu() {
  const u = window.claude;
  return u?.use ? Du ??= Promise.resolve(u.use("downloads")).catch(() => null) : Promise.resolve(null);
}
const Gn = (u, n) => u[0] === n[0] && u[1] === n[1] && u[2] === n[2];
async function wu() {
  ra("[data-i]").forEach((g) => {
    g.innerHTML = ss[g.dataset.i] || "", g.setAttribute("aria-hidden", "true");
  });
  const u = _e("#boot-status");
  _e("#boot-version").textContent = "v" + Xn, document.documentElement.dataset.version = Xn;
  const n = Cr;
  let t;
  try {
    u.textContent = "Starting the PDF engine…";
    const [g, S] = await Promise.all([n("pdfium.wasm"), n("harfbuzz.wasm")]);
    t = await So.load(g), await _l(S);
  } catch (g) {
    u.textContent = `The PDF engine couldn't start in this browser: ${g?.message || g}. Try a current version of Chrome, Edge, Safari or Firefox.`, _e("#boot").classList.add("failed");
    return;
  }
  const e = new Vl(t), r = new tc(_e("#viewer"), e), o = new dc(e, r), a = new bc(e, r);
  o.arrange = a, a.onChange = () => V();
  const s = new wc(e, r);
  o.crop = s, s.onChange = () => V();
  const i = new hu(e, r);
  o.textbox = i, o.links = new mu(e, r), o.forms = new _u(e, r), i.onChange = () => V(), a.onFreeText = (g, S, I, R) => {
    i.update(g, S, I, R);
  };
  const l = () => e.selectedPages.size > 1 ? [...e.selectedPages].sort((g, S) => g - S) : null, h = new gu(_e("#thumbs"), e), m = new Fu(_e("#comments"), e);
  window.__margin = { app: e, viewer: r, ix: o, arrange: a, Growable: Yt };
  const _ = new Gc(e, r), p = y("div", { class: "side-pane", id: "pane-pages" }, bu((g) => ve(g)), h.list);
  _.el.id = "pane-bookmarks", _.el.classList.add("side-pane"), _.el.hidden = true;
  const P = (g, S, I) => y("button", { class: "side-tab", type: "button", role: "tab", id: "tab-" + g, "aria-controls": "pane-" + g, onclick: () => D(g) }, y("span", { text: S }), y("span", { class: "count", id: I })), D = (g) => {
    for (const S of ["pages", "bookmarks"]) {
      const I = S === g;
      _e("#tab-" + S).setAttribute("aria-selected", String(I)), _e("#tab-" + S).classList.toggle("on", I), _e("#pane-" + S).hidden = !I;
    }
    try {
      localStorage.setItem("margin.side", g);
    } catch {
    }
  };
  _e("#thumbs").append(y("div", { class: "panel-head side-tabs", role: "tablist", "aria-label": "Sidebar" }, P("pages", "Pages", "page-count"), P("bookmarks", "Bookmarks", "bm-count")), p, _.el), _.onCount = (g) => {
    _e("#bm-count").textContent = g ? String(g) : "";
  }, D((() => {
    try {
      return localStorage.getItem("margin.side") === "bookmarks" ? "bookmarks" : "pages";
    } catch {
      return "pages";
    }
  })());
  const x = _e("#rail");
  [["select", "arrange", "edittext", "addtext"], ["highlight", "underline", "strike"], ["textbox", "draw", "line", "rect", "ellipse", "note"], ["image", "stamp", "sign", "link"], ["form", "redact", "crop"]].forEach((g, S) => {
    S && x.append(y("div", { class: "rail-sep", role: "separator" }));
    for (const I of g) {
      const R = Jr[I];
      x.append(y("button", { class: "tool", type: "button", "data-tool": I, "aria-label": `${R.label} (${R.key})`, title: `${R.label}  ${R.key}`, onclick: () => e.setTool(I) }, Ve(R.icon), y("span", { class: "tool-label", text: R.label })));
    }
  }), x.addEventListener("pointerover", (g) => {
    const S = g.target.closest(".tool");
    if (!S) return;
    const I = S.getBoundingClientRect();
    S.style.setProperty("--lx", I.right + 8 + "px"), S.style.setProperty("--ly", I.top + I.height / 2 + "px");
  }), x.addEventListener("focusin", (g) => {
    const S = g.target.closest(".tool");
    if (!S) return;
    const I = S.getBoundingClientRect();
    S.style.setProperty("--lx", I.right + 8 + "px"), S.style.setProperty("--ly", I.top + I.height / 2 + "px");
  }), e.onTool((g) => x.querySelector(`.tool[data-tool="${g}"]`)?.scrollIntoView({ block: "nearest", inline: "nearest" }));
  const w = _e("#ribbon"), k = (g, S, I, R) => y("div", { class: "swatches", role: "radiogroup", "aria-label": R }, ...g.map((L) => y("button", { class: "sw" + (Gn(L, S) ? " on" : ""), type: "button", role: "radio", "aria-checked": String(Gn(L, S)), "aria-label": `rgb ${L.slice(0, 3).join(" ")}`, style: { background: `rgb(${L[0]},${L[1]},${L[2]})` }, onclick: () => {
    I(L), e.saveSettings(), V();
  } }))), G = (g, S) => y("div", { class: "chips", role: "radiogroup", "aria-label": "Stroke width" }, ...[1, 2, 4, 8].map((I) => y("button", { class: "chip" + (I === g ? " on" : ""), type: "button", role: "radio", "aria-checked": String(I === g), title: `${I} pt`, onclick: () => {
    S(I), e.saveSettings(), V();
  } }, y("span", { class: "wline", style: { height: Math.min(I, 6) + "px" } }), y("span", { class: "num", text: `${I}` })))), E = (g, S) => y("label", { class: "rfield" }, y("span", { class: "rlabel", text: g }), S);
  // colour swatches with an optional None and a custom colour picker; pick(c) gets an RGBA or null
  const Hx = (g) => "#" + g.slice(0, 3).map((S) => S.toString(16).padStart(2, "0")).join(""), Ux = (g) => [parseInt(g.slice(1, 3), 16), parseInt(g.slice(3, 5), 16), parseInt(g.slice(5, 7), 16), 255];
  function Cp(g, S, I, R, L = false) {
    const j = !S || g.some((K) => Gn(K, S)), F = y("input", { type: "color", class: "sw custom" + (j ? "" : " on"), title: "Custom colour…", "aria-label": `${R}: custom colour`, value: S ? Hx(S) : "#3b82f6", style: j ? {} : { background: Mn(S) } });
    return F.addEventListener("change", () => I(Ux(F.value))), y("div", { class: "swatches", role: "radiogroup", "aria-label": R }, ...L ? [y("button", { class: "sw none" + (S ? "" : " on"), type: "button", role: "radio", "aria-checked": String(!S), title: "None", "aria-label": "None", onclick: () => I(null) })] : [], ...g.map((K) => {
      const se = !!S && Gn(K, S);
      return y("button", { class: "sw" + (se ? " on" : ""), type: "button", role: "radio", "aria-checked": String(se), "aria-label": `rgb ${K.slice(0, 3).join(" ")}`, style: { background: Mn(K) }, onclick: () => I(K) });
    }), F);
  }
  // opacity slider (10–100 %); commits on release
  function Op(g, S) {
    const I = y("span", { class: "unit op-val", text: Math.round(g * 100) + "%" }), R = y("input", { type: "range", class: "op-range", min: "10", max: "100", step: "5", value: String(Math.round(g * 100)), "aria-label": "Opacity" });
    return R.addEventListener("input", () => I.textContent = R.value + "%"), R.addEventListener("change", () => S(+R.value / 100)), E("Opacity", y("span", { class: "withunit" }, R, I));
  }
  const SFILLS = [[255, 255, 255, 255], ...lt.highlight];
  function B() {
    const g = o.editor, S = g ? { fontKey: g.selFont || g.fontKey, size: g.selSize || g.size, color: g.color } : { fontKey: e.settings.textFont, size: e.settings.textSize, color: e.settings.textColor }, I = y("select", { class: "rselect", id: "font-select", "aria-label": "Font" });
    for (const re of ["Standard", "Thai + Latin", "Latin"]) I.append(y("optgroup", { label: re }, ...sn.filter((ie) => ie.group === re).map((ie) => y("option", { value: ie.key, text: ie.label, selected: ie.key === S.fontKey }))));
    I.addEventListener("change", () => {
      o.editor ? o.setEditorStyle({ fontKey: I.value }) : (e.settings.textFont = I.value, e.saveSettings(), $t(ze(I.value)).catch((re) => H(re.message, "err")));
    });
    const R = y("input", { class: "rnum", id: "font-size", type: "number", min: "4", max: "144", step: "0.5", value: String(Math.round(S.size * 10) / 10), "aria-label": "Font size in points" });
    R.addEventListener("change", () => {
      const re = Math.max(4, Math.min(144, +R.value || 12));
      o.editor ? o.setEditorStyle({ size: re }) : (e.settings.textSize = re, e.saveSettings());
    });
    const L = k(lt.pen, S.color, (re) => {
      o.editor ? o.setEditorStyle({ color: re }) : e.settings.textColor = re;
    }, "Text color"), j = g ? g.style : Gr(e.settings.textStyle), F = (re) => re.preventDefault(), K = (re, ie, me, pe, Ie) => y("button", { class: "fmt " + pe + (j[re] ? " on" : ""), type: "button", "aria-pressed": String(!!j[re]), "aria-label": ie, title: `${ie} (Ctrl+${Ie})`, text: me, onmousedown: F, onclick: () => W({ [re]: !j[re] }) }), se = y("div", { class: "fmt-group", role: "group", "aria-label": "Text style" }, K("bold", "Bold", "B", "b", "B"), K("italic", "Italic", "I", "i", "I"), K("underline", "Underline", "U", "u", "U"), K("strike", "Strikethrough", "S", "s", "Shift+X")), te = [E("Font", I), E("Size", y("span", { class: "withunit" }, R, y("span", { class: "unit", text: "pt" }))), se];
    if (!g || g.kind !== "object") {
      const re = g ? g.align : e.settings.textAlign, ie = (Me, Ye, Je) => y("button", { class: "fmt" + (re === Me ? " on" : ""), type: "button", "aria-pressed": String(re === Me), "aria-label": Ye, title: Ye, onmousedown: F, onclick: () => N(Me) }, Ve(Je));
      if (g) {
        const Me = g.list || null, Ye = (Je, Vt, En) => y("button", { class: "fmt" + (Me === Je ? " on" : ""), type: "button", "aria-pressed": String(Me === Je), "aria-label": Vt, title: Vt, onmousedown: F, onclick: () => o.toggleList(Je) }, Ve(En));
        te.push(y("div", { class: "fmt-group", role: "group", "aria-label": "Lists" }, Ye("b", "Bulleted list", "listb"), Ye("n", "Numbered list", "listn")));
      }
      te.push(y("div", { class: "fmt-group", role: "group", "aria-label": "Alignment" }, ie("left", "Align left", "alignl"), ie("center", "Center", "alignc"), ie("right", "Align right", "alignr"), ie("justify", "Justify (wrapped text)", "alignj")));
      const me = g ? g.lh : e.settings.textLh, pe = [1, 1.15, 1.5, 2, 2.5];
      pe.some((Me) => Math.abs(Me - me) < 0.01) || (pe.push(+me.toFixed(2)), pe.sort((Me, Ye) => Me - Ye));
      const Ie = y("select", { class: "rselect narrow", id: "line-height", "aria-label": "Line spacing" }, ...pe.map((Me) => y("option", { value: String(Me), text: String(Me), selected: Math.abs(Me - me) < 0.01 })));
      Ie.addEventListener("change", () => {
        const Me = +Ie.value;
        o.editor ? o.setEditorStyle({ lh: Me }) : (e.settings.textLh = Me, e.saveSettings());
      }), te.push(E("Spacing", Ie));
    }
    return te.push(L), te;
  }
  function z(g, S) {
    const I = y("select", { class: "rselect", "aria-label": "Font" });
    for (const j of ["Standard", "Thai + Latin", "Latin"]) I.append(y("optgroup", { label: j }, ...sn.filter((F) => F.group === j).map((F) => y("option", { value: F.key, text: F.label, selected: F.key === g.textFont }))));
    I.addEventListener("change", () => S({ textFont: I.value }));
    const R = y("input", { class: "rnum", type: "number", min: "4", max: "96", step: "0.5", value: String(g.ftSize), "aria-label": "Font size in points" });
    R.addEventListener("change", () => S({ ftSize: Math.max(4, Math.min(96, +R.value || 12)) }));
    const L = (j, F, K, se) => y("div", { class: "swatches", role: "radiogroup", "aria-label": se }, ...j.map((te) => {
      const re = te === null ? F === null : !!F && Gn(te, F);
      return y("button", { class: "sw" + (re ? " on" : "") + (te ? "" : " none"), type: "button", role: "radio", "aria-checked": String(re), title: te ? `rgb ${te.slice(0, 3).join(" ")}` : "None", "aria-label": te ? `rgb ${te.slice(0, 3).join(" ")}` : "None", style: te ? { background: `rgb(${te[0]},${te[1]},${te[2]})` } : {}, onclick: () => K(te) });
    }));
    return [I, y("span", { class: "withunit" }, R, y("span", { class: "unit", text: "pt" })), E("Text", L(lt.pen, g.ftColor, (j) => S({ ftColor: j }), "Text color")), E("Fill", L([null, [255, 255, 255, 255], [255, 249, 196, 255], [219, 234, 254, 255], [252, 231, 243, 255]], g.ftFill, (j) => S({ ftFill: j }), "Fill")), E("Border", L([null, ...lt.pen], g.ftBorder, (j) => S({ ftBorder: j }), "Border"))];
  }
  async function O() {
    const g = e.doc.redactMarks(), S = g.reduce((L, j) => L + j.rects.length, 0);
    if (!S || await nt({ title: `Apply ${S} redaction${S === 1 ? "" : "s"}?`, body: y("div", { class: "stack" }, y("p", { class: "modal-text", text: `Text, images and drawings under the marks on ${g.length} page${g.length === 1 ? "" : "s"} are removed from the file, along with comments and form fields that sit mostly inside them.` }), y("p", { class: "modal-text", text: "Undo works until you close this file, but a saved copy can’t be un-redacted." })), actions: [{ id: "cancel", label: "Cancel" }, { id: "go", label: "Redact", danger: true }] }) !== "go") return;
    let R = 0;
    await e.mutate("Apply redactions", { pages: "all" }, () => {
      R = e.doc.applyRedactions(e.settings.redactFill), e.mustRewrite = true;
    }).catch((L) => H(L.message, "err")), R && H(`Redacted ${S} area${S === 1 ? "" : "s"} on ${R} page${R === 1 ? "" : "s"}`);
  }
  function W(g) {
    o.editor ? o.setEditorStyle({ style: g }) : (e.settings.textStyle = Mr({ ...Gr(e.settings.textStyle), ...g }), e.saveSettings()), V();
  }
  function N(g) {
    o.editor ? o.setEditorStyle({ align: g }) : (e.settings.textAlign = g, e.saveSettings()), V();
  }
  function V() {
    const g = e.tool, S = e.settings, I = Jr[g], R = [y("span", { class: "rtool", text: I.label })];
    if (g === "select") {
      const L = e.selectedAnnot;
      if (L) {
        const j = e.doc.annots(L.page).find((F) => F.index === L.index);
        if (j) {
          if (j.subtype === 3 && j.ft) {
            const F = e.doc.readFreeText(L.page, L.index), K = { ftSize: F.style.size, ftColor: F.style.color, ftFill: F.style.fill, ftBorder: F.style.border, textFont: F.style.fontKey };
            R.push(...z(K, (se) => i.update(L.page, L.index, (te) => ({ ...te, style: { ...te.style, ...se.ftSize ? { size: se.ftSize } : {}, ...se.ftColor ? { color: se.ftColor } : {}, ..."ftFill" in se ? { fill: se.ftFill } : {}, ..."ftBorder" in se ? { border: se.ftBorder } : {}, ...se.textFont ? { fontKey: se.textFont } : {} } }), "Restyle text box")));
          } else if (j.subtype === Q.SQUARE || j.subtype === Q.CIRCLE) {
            const F = e.doc.annotStyle(L.page, L.index) || { width: 1, dashed: false, fill: null, opacity: 1 }, K = (te, re) => e.mutate(re, { pages: [L.page] }, te).catch((ie) => H(ie.message, "err")), se = (te, re) => K(() => e.doc.setAnnotStyle(L.page, L.index, te), re);
            R.push(E("Outline", Cp(lt.pen, j.color, (te) => !te && !F.fill ? H("A shape needs an outline or a fill", "warn") : K(() => e.doc.setAnnotColor(L.page, L.index, te), te ? "Outline colour" : "Remove outline"), "Outline colour", true)), E("Fill", Cp(SFILLS, F.fill, (te) => !te && !j.color ? H("A shape needs an outline or a fill", "warn") : se({ fill: te }, te ? "Fill shape" : "Remove fill"), "Fill colour", true)), y("div", { class: "chips", role: "radiogroup", "aria-label": "Outline width" }, ...[1, 2, 4, 8].map((te) => {
              const re = Math.abs(F.width - te) < 0.26;
              return y("button", { class: "chip" + (re ? " on" : ""), type: "button", role: "radio", "aria-checked": String(re), title: `${te} pt`, onclick: () => se({ width: te }, "Outline width") }, y("span", { class: "wline", style: { height: Math.min(te, 6) + "px" } }), y("span", { class: "num", text: `${te}` }));
            }), y("button", { class: "chip" + (F.dashed ? " on" : ""), type: "button", "aria-pressed": String(F.dashed), title: "Dashed outline", onclick: () => se({ dashed: !F.dashed }, F.dashed ? "Solid outline" : "Dashed outline") }, "Dashed")), Op(F.opacity, (te) => se({ opacity: te }, "Opacity")));
          } else if (j.subtype !== 13 && j.color) {
            R.push(Cp(j.subtype === 9 || j.subtype === 1 ? lt.highlight : lt.pen, j.color, (F) => e.mutate("Change color", { pages: [L.page] }, () => e.doc.setAnnotColor(L.page, L.index, F)).catch((K) => H(K.message, "err")), "Annotation color"));
            if (j.subtype === Q.LINE || j.subtype === Q.INK || j.subtype >= 9 && j.subtype <= 12) {
              const F = e.doc.annotStyle(L.page, L.index);
              F && R.push(Op(F.opacity, (K) => e.mutate("Opacity", { pages: [L.page] }, () => e.doc.setAnnotStyle(L.page, L.index, { opacity: K })).catch((se) => H(se.message, "err"))));
            }
          }
          R.push(y("button", { class: "btn ghost small", type: "button", onclick: () => Lt() }, Ve("trash"), "Delete")), R.push(y("span", { class: "hint", text: j.subtype >= 9 && j.subtype <= 12 ? "Text markup stays attached to its text." : j.subtype === 3 ? "Drag to move. Double-click to edit the text." : "Drag to move. Double-click to comment." }));
        }
      } else R.push(y("span", { class: "hint", text: I.hint }));
    } else if (g === "arrange") {
      const L = a.sel, j = a.current();
      if (a.cropping) R.push(y("button", { class: "btn primary small", type: "button", title: "Enter", onclick: () => a.applyCrop(ia) }, Ve("crop"), "Apply crop"), y("button", { class: "btn ghost small", type: "button", title: "Esc", onclick: () => a.cancelCrop() }, "Cancel"), y("span", { class: "hint", text: "Drag the edges to choose what to keep. Cropping trims the picture itself, so the cut part leaves the file." }));
      else if (L) {
        const F = (se, te, re, ie = false) => y("button", { class: "iconbtn", type: "button", title: se, "aria-label": se, disabled: ie, onclick: re }, Ve(te)), K = a.selected().length;
        R.push(y("div", { class: "fmt-group", role: "group", "aria-label": K > 1 ? "Align" : "Align to page" }, F(K > 1 ? "Align left edges" : "Align to the page’s left edge", "al-left", () => a.align("left")), F(K > 1 ? "Align centres" : "Centre on the page", "al-hcenter", () => a.align("hcenter")), F(K > 1 ? "Align right edges" : "Align to the page’s right edge", "al-right", () => a.align("right")), F(K > 1 ? "Align tops" : "Align to the page’s top", "al-top", () => a.align("top")), F(K > 1 ? "Align middles" : "Centre on the page vertically", "al-vmiddle", () => a.align("vmiddle")), F(K > 1 ? "Align bottoms" : "Align to the page’s bottom", "al-bottom", () => a.align("bottom"))), y("div", { class: "fmt-group", role: "group", "aria-label": "Distribute and match size" }, F("Distribute across (3 or more)", "dist-h", () => a.distribute("h"), K < 3), F("Distribute down (3 or more)", "dist-v", () => a.distribute("v"), K < 3), F("Match width of the last clicked", "match-w", () => a.matchSize("w"), K < 2), F("Match height of the last clicked", "match-h", () => a.matchSize("h"), K < 2), F("Match size of the last clicked", "match-both", () => a.matchSize("both"), K < 2)), y("div", { class: "fmt-group", role: "group", "aria-label": "Order" }, F("Bring to front (Ctrl+Shift+])", "z-front", () => a.restack("front")), F("Bring forward (Ctrl+])", "z-forward", () => a.restack("forward")), F("Send backward (Ctrl+[)", "z-backward", () => a.restack("backward")), F("Send to back (Ctrl+Shift+[)", "z-back", () => a.restack("back")))), j?.kind === "image" && (R.push(y("div", { class: "fmt-group", role: "group", "aria-label": "Image" }, F("Rotate left", "rotl", () => a.turn("rotl")), F("Rotate right", "rotr", () => a.turn("rotr")), F("Flip horizontally", "fliph", () => a.turn("fliph")), F("Flip vertically", "flipv", () => a.turn("flipv")))), j.label === "Image" && R.push(y("button", { class: "btn ghost small", type: "button", onclick: () => a.startCrop() }, Ve("crop"), "Crop"), y("button", { class: "btn ghost small", type: "button", onclick: () => xt() }, Ve("image"), "Replace"))), R.push(y("button", { class: "btn ghost small", type: "button", onclick: () => a.remove() }, Ve("trash"), K > 1 ? `Delete ${K}` : "Delete")), K === 1 && j?.kind !== "image" && R.push(y("span", { class: "hint", text: "Shift-click or drag a box to select more. Arrows nudge 1 pt (Shift: 10)." }));
      } else R.push(y("span", { class: "hint", text: I.hint }));
    } else if (g === "highlight") R.push(k(lt.highlight, S.markupColor, (L) => S.markupColor = L, "Highlight color"), y("span", { class: "hint", text: I.hint }));
    else if (g === "underline" || g === "strike") R.push(k(lt.pen, S.lineMarkupColor, (L) => S.lineMarkupColor = L, "Line color"), y("span", { class: "hint", text: I.hint }));
    else if (g === "draw") R.push(k(lt.pen, S.inkColor, (L) => S.inkColor = L, "Pen color"), G(S.inkWidth, (L) => S.inkWidth = L));
    else if (g === "stamp") {
      const L = y("select", { class: "rselect", "aria-label": "Stamp" }, y("optgroup", { label: "English" }, ...Rn.filter((K) => !K.key.startsWith("th-")).map((K) => y("option", { value: K.key, text: K.label, selected: S.stamp === K.key }))), y("optgroup", { label: "ไทย" }, ...Rn.filter((K) => K.key.startsWith("th-")).map((K) => y("option", { value: K.key, text: K.label, selected: S.stamp === K.key }))), y("option", { value: "custom", text: "Custom…", selected: S.stamp === "custom" }));
      L.addEventListener("change", () => {
        S.stamp = L.value, e.saveSettings(), V();
      });
      const j = S.stamp === "custom" ? { label: S.stampCustom || "CUSTOM", color: S.stampColor } : Rn.find((K) => K.key === S.stamp) || Rn[0];
      if (R.push(L, y("span", { class: "stamp-chip", style: { color: `rgb(${j.color[0]},${j.color[1]},${j.color[2]})` }, text: j.label })), S.stamp === "custom") {
        const K = y("input", { class: "tinput narrow", id: "stamp-text", value: S.stampCustom, placeholder: "Stamp text", "aria-label": "Custom stamp text" });
        K.addEventListener("input", () => {
          S.stampCustom = K.value, e.saveSettings();
        }), R.push(K, k([[196, 40, 40, 255], [37, 99, 235, 255], [22, 140, 82, 255], [124, 77, 219, 255], [24, 26, 33, 255]], S.stampColor, (se) => S.stampColor = se, "Stamp color"));
      }
      const F = y("input", { type: "checkbox", checked: S.stampDated });
      if (F.addEventListener("change", () => {
        S.stampDated = F.checked, e.saveSettings(), V();
      }), R.push(y("label", { class: "hf-check" }, F, "Name & date")), S.stampDated) {
        const K = y("input", { class: "tinput narrow", value: S.author, "aria-label": "Your name", placeholder: "Your name" });
        K.addEventListener("change", () => {
          S.author = K.value.trim() || "Me", e.saveSettings();
        }), R.push(K);
      }
      R.push(y("span", { class: "hint", text: I.hint }));
    } else if (g === "form") R.push(y("div", { class: "chips", role: "radiogroup", "aria-label": "Field type" }, ...kr.map((L) => y("button", { class: "chip" + (S.formKind === L.kind ? " on" : ""), type: "button", role: "radio", "aria-checked": String(S.formKind === L.kind), onclick: () => {
      S.formKind = L.kind, e.saveSettings(), V();
    } }, L.label))), y("span", { class: "hint", text: I.hint }));
    else if (g === "redact") {
      const j = e.doc.redactMarks().reduce((te, re) => te + re.rects.length, 0), F = (te, re) => y("button", { class: "chip" + (S.redactMode === te ? " on" : ""), type: "button", role: "radio", "aria-checked": String(S.redactMode === te), onclick: () => {
        S.redactMode = te, e.saveSettings(), V();
      } }, re);
      R.push(y("div", { class: "chips", role: "radiogroup", "aria-label": "Mark" }, F("text", "Text"), F("area", "Area")));
      const K = y("input", { class: "tinput narrow", placeholder: "Mark every…", "aria-label": "Mark every match of this text", id: "redact-find" }), se = async () => {
        const te = K.value.trim();
        if (!te) return;
        const re = e.doc.search(te);
        if (!re.length) return H(`No matches for “${te}”`, "warn");
        const ie = /* @__PURE__ */ new Map();
        for (const me of re) ie.set(me.page, [...ie.get(me.page) || [], ...me.rects]);
        await e.mutate(`Mark “${te}” for redaction`, { pages: [...ie.keys()] }, () => {
          for (const [me, pe] of ie) e.doc.addRedactMark(me, pe, S.author);
        }).catch((me) => H(me.message, "err")), H(`Marked ${re.length} match${re.length === 1 ? "" : "es"}`);
      };
      K.addEventListener("keydown", (te) => {
        te.stopPropagation(), te.key === "Enter" && se();
      }), R.push(K, y("button", { class: "btn ghost small", type: "button", onclick: se }, "Mark all")), R.push(E("Cover", y("div", { class: "swatches", role: "radiogroup", "aria-label": "Cover colour" }, ...[[0, 0, 0, 255], [255, 255, 255, 255], null].map((te) => {
        const re = te === null ? S.redactFill === null : !!S.redactFill && Gn(te, S.redactFill);
        return y("button", { class: "sw" + (re ? " on" : "") + (te ? "" : " none"), type: "button", role: "radio", "aria-checked": String(re), title: te ? te[0] ? "White" : "Black" : "No cover (leave the area blank)", "aria-label": te ? te[0] ? "White" : "Black" : "None", style: te ? { background: `rgb(${te[0]},${te[1]},${te[2]})` } : {}, onclick: () => {
          S.redactFill = te, e.saveSettings(), V();
        } });
      })))), j ? R.push(y("button", { class: "btn danger small", type: "button", onclick: () => O() }, `Apply ${j} mark${j === 1 ? "" : "s"}`), y("button", { class: "btn ghost small", type: "button", onclick: () => e.mutate("Clear redaction marks", { pages: "all" }, () => e.doc.clearRedactMarks()) }, "Clear")) : R.push(y("span", { class: "hint", text: I.hint }));
    } else if (g === "textbox") {
      const L = (j, F) => y("button", { class: "chip" + (S.ftCallout === j ? " on" : ""), type: "button", role: "radio", "aria-checked": String(S.ftCallout === j), onclick: () => {
        S.ftCallout = j, e.saveSettings(), V();
      } }, F);
      R.push(y("div", { class: "chips", role: "radiogroup", "aria-label": "Kind" }, L(false, "Text box"), L(true, "Callout")), ...z(S, (j) => {
        Object.assign(S, j), e.saveSettings(), V();
      }), y("span", { class: "hint", text: i.open ? "Ctrl+Enter or click outside to finish · Esc to cancel" : S.ftCallout ? "Press on the target, drag to place the box, type." : I.hint }));
    } else if (g === "line") {
      const L = (j, F, K) => y("button", { class: "chip" + (S.lineEnds === j ? " on" : ""), type: "button", role: "radio", "aria-checked": String(S.lineEnds === j), onclick: () => {
        S.lineEnds = j, e.saveSettings(), V();
      } }, y("span", { class: "num", text: K }), F);
      R.push(y("div", { class: "chips", role: "radiogroup", "aria-label": "Line ends" }, L("none", "Line", "—"), L("arrow", "Arrow", "→"), L("double", "Double", "↔")), k(lt.pen, S.lineColor, (j) => S.lineColor = j, "Line color"), G(S.lineWidth, (j) => S.lineWidth = j), y("span", { class: "hint", text: I.hint }));
    } else if (g === "rect" || g === "ellipse") {
      const L = (j) => (j(), e.saveSettings(), V());
      R.push(E("Outline", Cp(lt.pen, S.shapeColor, (j) => L(() => S.shapeColor = j), "Outline colour", true)), E("Fill", Cp(SFILLS, S.shapeFill, (j) => L(() => S.shapeFill = j), "Fill colour", true)), G(S.shapeWidth, (j) => S.shapeWidth = j), Op(S.shapeOpacity ?? 1, (j) => L(() => S.shapeOpacity = j)));
    }
    else if (g === "note") R.push(k(lt.highlight, S.noteColor, (L) => S.noteColor = L, "Note color"), y("span", { class: "hint", text: I.hint }));
    else if (g === "addtext") R.push(...B(), y("span", { class: "hint", text: o.editor ? "Select words to style them · Ctrl+Enter or click outside to finish" : "Click to type, or drag across to set a width the text wraps to." }));
    else if (g === "edittext") o.editor ? R.push(...B(), y("span", { class: "hint", text: o.editor.kind === "object" ? "Enter to save · Shift+Enter adds a line · Esc cancels" : "Select words to style them · Ctrl+Enter or click outside to save · Esc cancels" })) : R.push(y("span", { class: "hint", text: I.hint }));
    else if (g === "crop") {
      const L = s.sel, j = l(), F = [...Array(e.doc.pageCount).keys()];
      if (L) R.push(y("button", { class: "btn primary small", type: "button", title: "Enter", onclick: () => s.apply([L.page]) }, Ve("crop"), `Crop page ${L.page + 1}`)), j && R.push(y("button", { class: "btn ghost small", type: "button", onclick: () => s.apply(j) }, `Crop ${j.length} selected pages`)), e.doc.pageCount > 1 && R.push(y("button", { class: "btn ghost small", type: "button", onclick: () => s.apply(F) }, "Crop all pages")), R.push(y("button", { class: "btn ghost small", type: "button", title: "Esc", onclick: () => {
        s.sel = null, s.refresh(), V();
      } }, "Cancel")), R.push(y("span", { class: "hint", text: "Drag the edges to adjust. Other pages lose the same margins." }));
      else {
        R.push(y("span", { class: "hint", text: I.hint }));
        const K = e.currentPage;
        s.isCropped(K) && R.push(y("button", { class: "btn ghost small", type: "button", onclick: () => s.reset([K]) }, `Uncrop page ${K + 1}`)), e.doc.pageCount > 1 && F.some((se) => se !== K && s.isCropped(se)) && R.push(y("button", { class: "btn ghost small", type: "button", onclick: () => s.reset(F) }, "Uncrop all pages"));
      }
    } else if (g === "image") {
      const L = o.image;
      L && R.push(y("span", { class: "img-pick" }, y("img", { src: L.url, alt: "" }), y("span", { class: "mono", text: `${L.w}×${L.h}` }))), R.push(y("button", { class: "btn ghost small", type: "button", onclick: () => o.chooseImage() }, Ve("image"), L ? "Choose another" : "Choose image")), R.push(y("span", { class: "hint", text: L ? I.hint : "Choose an image to place." }));
    } else g === "sign" && (o.saved.length && R.push(y("div", { class: "sig-strip", role: "radiogroup", "aria-label": "Signature to place" }, ...o.saved.map((L, j) => y("button", { class: "sig-pick" + (j === o.activeSig ? " on" : ""), type: "button", role: "radio", "aria-checked": String(j === o.activeSig), "aria-label": `Signature ${j + 1}`, onclick: () => o.chooseSaved(j) }, y("img", { src: L.url, alt: "" }))))), R.push(y("button", { class: "btn ghost small", type: "button", onclick: async () => {
      await o.captureSignature(), V();
    } }, Ve("plus"), o.saved.length ? "New signature" : "Draw signature")), o.signature && R.push(y("button", { class: "btn ghost small", type: "button", title: "Remove the selected signature from this browser", onclick: () => o.removeSaved(o.activeSig) }, Ve("trash"), "Remove")), R.push(y("span", { class: "hint", text: o.signature ? I.hint : "Draw a signature to start." })));
    R.length === 1 && R.push(y("span", { class: "hint", text: I.hint })), w.replaceChildren(...R);
  }
  const q = y("input", { type: "file", accept: "application/pdf,.pdf", hidden: true, id: "file-open" }), Y = y("input", { type: "file", accept: "application/pdf,.pdf", multiple: true, hidden: true, id: "file-merge" }), ne = y("input", { type: "file", accept: "application/pdf,.pdf", hidden: true, id: "file-replace" });
  ne.addEventListener("change", () => {
    const g = ne.files?.[0];
    ne.value = "", g && It(g);
  }), document.body.append(q, Y, ne), _e("#btn-open").addEventListener("click", () => q.click()), _e("#btn-merge").addEventListener("click", () => Y.click()), _e("#btn-version").textContent = "v" + Xn, _e("#btn-version").addEventListener("click", () => nt({ title: `Margin ${Xn}`, body: y("div", { class: "changelog" }, ...Pu.map((g) => y("section", {}, y("h3", {}, y("span", { class: "mono", text: "v" + g.version }), g.version === Xn ? y("span", { class: "dirty", text: "Current" }) : null), y("ul", {}, ...g.notes.map((S) => y("li", { text: S })))))), actions: [{ id: "ok", label: "Close", primary: true }] })), _e("#btn-flatten").addEventListener("click", async () => {
    o.editor && o.commitEditor();
    const g = e.doc.flattenCounts();
    if (!g.annots && !g.fields) return H("Nothing to flatten: this document has no comments, markup or form fields", "warn", 4e3);
    const S = y("input", { type: "checkbox", id: "fl-annots", checked: g.annots > 0, disabled: g.annots === 0 }), I = y("input", { type: "checkbox", id: "fl-fields", checked: g.fields > 0, disabled: g.fields === 0 }), R = y("div", { class: "stack" }, y("p", { class: "modal-text", text: "Flattening draws these into the page itself. They will look the same everywhere but can no longer be edited, moved or filled in. Links stay clickable." }), y("label", { class: "hf-check" }, S, `Comments, markup, shapes, stamps and text boxes (${g.annots})`), y("label", { class: "hf-check" }, I, `Form fields, with what is filled in now (${g.fields})`));
    if (await nt({ title: "Flatten", body: R, actions: [{ id: "cancel", label: "Cancel" }, { id: "go", label: "Flatten", primary: true }] }) !== "go") return;
    const j = { annots: S.checked, fields: I.checked };
    if (!j.annots && !j.fields) return;
    let F = { done: 0, failed: 0 };
    await e.mutate("Flatten", { pages: "all" }, () => {
      F = e.doc.flatten(j);
    }).catch((K) => H(K.message, "err")), H(F.failed ? `Flattened ${F.done}; ${F.failed} couldn’t be flattened and were left as they are` : `Flattened ${F.done} item${F.done === 1 ? "" : "s"}. Undo is available until you close the file.`, F.failed ? "warn" : "ok", 4500);
  });
  const J = new Lr(e, r), ee = () => {
    o.editor && o.commitEditor(), Tc(e, Ne);
  };
  _e("#btn-more").addEventListener("click", () => {
    const g = _e("#btn-more").getBoundingClientRect(), S = (I) => () => _e("#" + I).click();
    pn(g.right - 240, g.bottom + 6, [{ label: "Print…", shortcut: "Ctrl+P", run: S("btn-print") }, { label: "Export pages as images…", run: ee }, { label: "Compress…", run: () => {
      o.editor && o.commitEditor(), Oc(e, yr);
    } }, { label: "Check spelling…", shortcut: "F7", run: () => {
      o.editor && o.commitEditor(), J.open();
    } }, "sep", { label: "Password protection…", run: S("btn-protect") }, { label: "Watermark & background…", run: S("btn-wm") }, { label: "Header & footer…", run: S("btn-hf") }, { label: "Flatten…", run: S("btn-flatten") }, "sep", { label: "Insert pages from PDF…", run: () => Y.click() }, { label: "Replace pages…", run: () => ne.click() }, { label: "Extract or split pages…", run: () => ve("extract") }], _e("#btn-more"));
  }), _e("#btn-print").addEventListener("click", () => {
    o.editor && o.commitEditor(), Fa(e);
  }), _e("#btn-protect").addEventListener("click", () => {
    o.editor && o.commitEditor(), Sc(e);
  }), _e("#btn-wm").addEventListener("click", () => {
    o.editor && o.commitEditor(), jl(e, { ...ds, ...e.settings.wm || {} }, (g) => {
      e.settings.wm = g, e.saveSettings();
    });
  }), _e("#btn-hf").addEventListener("click", () => {
    o.editor && o.commitEditor(), Gl(e, { ...e.settings.hf, images: e.settings.hf.images || {}, imageHeight: e.settings.hf.imageHeight || 24 }, (g) => {
      e.settings.hf = g, e.saveSettings();
    });
  }), q.addEventListener("change", () => {
    const g = q.files?.[0];
    g && Ke(g), q.value = "";
  });
  let ae = null;
  Y.addEventListener("change", async () => {
    const g = [...Y.files || []];
    Y.value = "";
    const S = ae;
    ae = null, g.length && Le(g, S ?? void 0);
  }), _e("#btn-undo").addEventListener("click", () => Ae()), _e("#btn-redo").addEventListener("click", () => kn()), _e("#btn-save").addEventListener("click", () => Re()), _e("#btn-zoomin").addEventListener("click", () => r.setZoom(r.zoom * 1.2)), _e("#btn-zoomout").addEventListener("click", () => r.setZoom(r.zoom / 1.2)), _e("#btn-fit").addEventListener("click", () => {
    r.fit = "width", r.applyFit();
  }), _e("#btn-pages").addEventListener("click", () => document.body.classList.toggle("show-thumbs")), _e("#btn-comments").addEventListener("click", () => document.body.classList.toggle("show-comments"));
  const de = _e("#search-input");
  let oe = [], fe = -1;
  const we = () => {
    if (_e("#search-count").textContent = oe.length ? `${fe + 1} of ${oe.length}` : de.value ? "No matches" : "", r.setHits(oe, fe), fe >= 0) {
      const g = oe[fe];
      r.scrollToPage(g.page, g.rects[0]);
    }
  }, ce = () => {
    oe = e.doc.search(de.value.trim()), fe = oe.length ? 0 : -1, we();
  };
  de.addEventListener("keydown", (g) => {
    g.stopPropagation(), g.key === "Enter" && (!oe.length || de.dataset.last !== de.value ? (de.dataset.last = de.value, ce()) : (fe = (fe + (g.shiftKey ? -1 : 1) + oe.length) % oe.length, we())), g.key === "Escape" && (de.value = "", oe = [], fe = -1, we(), de.blur());
  }), _e("#search-next").addEventListener("click", () => {
    if (!oe.length) return ce();
    fe = (fe + 1) % oe.length, we();
  });
  const Ge = _e("#replace-panel"), ge = _e("#replace-input"), $e = _e("#rp-status"), Ce = () => ({ matchCase: _e("#rp-case").checked, wholeWord: _e("#rp-word").checked }), Ee = (g = Ge.hidden) => {
    Ge.hidden = !g, _e("#btn-replace").setAttribute("aria-expanded", String(g)), g && (de.value ? ge : de).focus();
  };
  _e("#btn-replace").addEventListener("click", () => Ee()), Ge.addEventListener("keydown", (g) => {
    g.stopPropagation(), g.key === "Escape" && Ee(false), g.key === "Enter" && g.target === ge && _e("#rp-one").click();
  }), _e("#rp-one").addEventListener("click", async () => {
    const g = de.value.trim();
    if (!g) {
      de.focus();
      return;
    }
    if (!oe.length || de.dataset.last !== de.value) {
      if (de.dataset.last = de.value, ce(), !oe.length) {
        $e.textContent = "No matches";
        return;
      }
      return;
    }
    const S = oe[fe];
    if (S) try {
      const I = await Cs(e, S.page, S.rects[0], g, ge.value, Ce());
      ce();
      const R = oe.findIndex((L) => L.page > S.page || L.page === S.page && L.rects[0].t <= S.rects[0].t + 1);
      oe.length && (fe = Math.max(0, R), we()), $e.textContent = I ? `Replaced 1 · ${oe.length} left` : "That match spans lines or differs in case; skipped", !I && oe.length && (fe = (oe.indexOf(S) + 1) % oe.length, we());
    } catch (I) {
      H(I.message, "err");
    }
  }), _e("#rp-all").addEventListener("click", async () => {
    const g = de.value.trim();
    if (!g) {
      de.focus();
      return;
    }
    try {
      const S = await nu(e, g, ge.value, Ce());
      ce();
      const I = tu(e, g, Ce());
      $e.textContent = `Replaced ${S.count} on ${S.pages} page${S.pages === 1 ? "" : "s"}${I ? ` · ${I} couldn’t be replaced` : ""}`, H(`Replaced ${S.count} match${S.count === 1 ? "" : "es"}`);
    } catch (S) {
      $e.textContent = S.message;
    }
  }), _e("#search-prev").addEventListener("click", () => {
    oe.length && (fe = (fe - 1 + oe.length) % oe.length, we());
  });
  const Oe = () => {
    _e("#file-name").textContent = e.fileName, _e("#file-name").title = e.fileName, _e("#dirty").hidden = !e.dirty;
    const g = _e("#btn-undo"), S = _e("#btn-redo");
    g.disabled = !e.canUndo, S.disabled = !e.canRedo, g.title = e.canUndo ? `Undo ${e.undoLabel}` : "Nothing to undo", S.title = e.canRedo ? `Redo ${e.redoLabel}` : "Nothing to redo", _e("#page-count").textContent = String(e.doc.pageCount), _e("#page-indicator").textContent = `${e.currentPage + 1} / ${e.doc.pageCount}`;
    const I = e.doc.security(), R = _e("#btn-protect");
    R.classList.toggle("on", I.encrypted), R.classList.toggle("limited", e.limits.locked), R.title = I.encrypted ? e.limits.locked ? "Protected: changes are limited. Click to unlock" : "Password protected (AES-256)" : "Password protection";
  };
  r.onZoom = (g) => {
    _e("#zoom-level").textContent = Math.round(g * 100) + "%";
  }, r.onPage = (g) => {
    h.follow(g), e.tool === "crop" && !s.sel && V(), _e("#page-indicator").textContent = `${g + 1} / ${e.doc.pageCount}`;
  }, h.onGo = (g) => r.scrollToPage(g), h.onSelection = () => {
  }, h.onInsertBlank = (g) => {
    const S = Math.max(0, Math.min(e.doc.pageCount - 1, g > 0 ? g - 1 : 0)), { w: I, h: R } = e.doc.pageSize(S);
    e.mutate("Insert blank page", { pages: "all", structure: true }, () => e.doc.insertBlank(g, I, R)).then(() => {
      e.selectedPages = /* @__PURE__ */ new Set([g]), h.mark(), r.scrollToPage(g), H(`Inserted a blank page as page ${g + 1}`);
    }).catch((L) => H(L.message, "err"));
  }, h.onInsertFrom = (g, S) => {
    S ? Le(S, g) : (ae = g, Y.click());
  }, h.onMove = (g, S) => e.mutate(g.length > 1 ? "Move pages" : "Move page", { pages: "all", structure: true }, () => {
    if (!e.doc.movePages(g, S)) throw new Error("Those pages could not be moved");
    e.selectedPages = new Set(g.map((I, R) => S + R));
  }).catch((I) => H(I.message, "err")), m.onGo = (g, S) => {
    e.setTool("select"), e.selectedAnnot = { page: g, index: S.index }, o.refreshOverlays(), r.scrollToPage(g, S.rect), m.markSelected(), V();
  }, o.onSelect = () => {
    m.markSelected(), V();
  }, o.onEditor = () => V(), m.onEditFreeText = (g, S, I) => {
    i.update(g, S, (R) => ({ ...R, text: I }), "Edit text box");
  }, o.onImage = () => {
    e.tool === "image" && V();
  }, o.onSignatures = () => {
    e.tool === "sign" && V();
  }, o.onFormatKey = (g) => {
    const S = o.editor;
    if (!S) return;
    const R = { b: "bold", i: "italic", u: "underline", x: "strike" }[g];
    R && W({ [R]: !S.style[R] });
  }, o.onNoteCreated = (g, S) => {
    document.body.classList.add("show-comments"), m.refresh(), m.focus(g, S);
  }, e.on((g) => {
    g.structure ? (r.rebuild(), h.rebuild()) : (r.invalidate(g.pages), h.invalidate(g.pages)), r.hits.length && (r.setHits([], -1), oe = [], fe = -1, _e("#search-count").textContent = ""), m.refresh(g), Oe(), V();
  }), e.onTool((g) => {
    ra(".tool").forEach((S) => {
      S.classList.toggle("on", S.dataset.tool === g), S.setAttribute("aria-pressed", String(S.dataset.tool === g));
    }), document.body.dataset.tool = g, o.editor && o.commitEditor(), i.open && i.open.done(true), o.refreshOverlays(), m.markSelected(), V(), (g === "addtext" || g === "edittext") && $t(ze(e.settings.textFont)).catch(() => {
    }), g !== "image" && o.image && o.setImage(null), g === "image" && (o.setImage(null), o.chooseImage().then((S) => {
      !S && e.tool === "image" && !o.image && e.setTool("select");
    })), g === "sign" && o.chooseSignature().then((S) => {
      !S && e.tool === "sign" ? e.setTool("select") : V();
    });
  });
  async function Ke(g) {
    if (e.dirty && !await ot()) return;
    let S;
    try {
      S = await Yt.fromFile(g);
    } catch (I) {
      H(`${g.name}: ${I.message || "could not be read"}`, "err", 6e3);
      return;
    }
    await dt(S, g.name);
  }
  async function Xe(g, S, I = "open") {
    const R = y("input", { class: "tinput", type: "password", id: "pdf-password", autocomplete: "off", "aria-label": "Password" });
    return await nt({ title: S ? "That password didn’t work" : "This PDF is password protected", body: y("div", { class: "stack" }, y("p", { class: "modal-text", text: `Enter the password to ${I} ${g}.` }), R), actions: [{ id: "cancel", label: "Cancel" }, { id: "ok", label: I === "open" ? "Open" : "Continue", primary: true }], onOpen: () => {
      R.focus(), R.addEventListener("keydown", (j) => {
        j.key === "Enter" && _e(".modal .btn.primary").click();
      });
    } }) === "ok" ? R.value : null;
  }
  async function dt(g, S, I = "") {
    try {
      e.open(g, S, I), r.el.scrollTop = 0, h.list.scrollTop = 0, e.limits.locked && H("This PDF limits what can be changed. To edit it, unlock it with its permissions password (the lock button).", "warn", 7e3);
    } catch (R) {
      if (R instanceof rr && R.code === 4) {
        const L = await Xe(S, !!I);
        return L != null ? dt(g, S, L) : void 0;
      }
      H(wo(R) ? `${S} is too large to open in a browser tab.` : `${S}: ${R.message}`, "err", 6e3);
    }
  }
  async function Rt(g, S) {
    const I = new Uint8Array(await g.arrayBuffer());
    let R = "", L = 0;
    for (; ; ) try {
      return t.open(I, R);
    } catch (j) {
      if (!(j instanceof rr && j.code === 4)) throw j;
      const F = await Xe(g.name, L++ > 0, S);
      if (F == null) return null;
      R = F;
    }
  }
  async function It(g) {
    const { locked: S, perms: I } = e.limits;
    if (S && !(I & 8)) return H("This PDF’s permissions don’t allow changes. Unlock it with its permissions password first.", "warn", 5e3);
    let R;
    try {
      R = await Rt(g, "replace pages with");
    } catch (Ze) {
      return H(`${g.name}: ${Ze.message}`, "err", 5e3);
    }
    if (!R) return;
    const L = e.doc.pageCount, j = R.pageCount, F = St(), K = y("input", { class: "tinput", id: "rp-target", value: ln(F), autocomplete: "off" }), se = y("input", { class: "tinput", id: "rp-source", value: j === 1 ? "1" : `1-${Math.min(j, F.length)}`, autocomplete: "off" }), te = y("p", { class: "modal-text", id: "rp-note" }), re = y("div", { class: "stack" }, y("label", { class: "rfield" }, y("span", { class: "rlabel", text: `Replace pages (of ${L})` }), K), y("label", { class: "rfield" }, y("span", { class: "rlabel", text: `with pages from ${g.name} (of ${j})` }), se), te, y("p", { class: "hint", text: "Comments and form fields on the replaced pages go with them. Bookmarks to them now point to the new pages. You can undo this." })), ie = () => {
      const Ze = ir(K.value, L), at = ir(se.value, j);
      if (Ze.some((Ft, mr) => mr && Ft !== Ze[mr - 1] + 1)) throw new Error("Choose a run of pages to replace, like 3-5");
      return { t: Ze, s: at };
    }, me = () => {
      try {
        const { t: Ze, s: at } = ie();
        te.textContent = `${Ze.length} page${Ze.length === 1 ? "" : "s"} out, ${at.length} in: the document will have ${L - Ze.length + at.length} pages.`, te.classList.remove("err");
      } catch (Ze) {
        te.textContent = Ze.message, te.classList.add("err");
      }
    };
    re.addEventListener("input", me), me();
    const pe = await nt({ title: "Replace pages", body: re, actions: [{ id: "cancel", label: "Cancel" }, { id: "ok", label: "Replace", primary: true }] });
    let Ie;
    try {
      if (pe !== "ok") {
        R.close();
        return;
      }
      Ie = ie();
    } catch (Ze) {
      return R.close(), H(Ze.message, "warn");
    }
    const { t: Me, s: Ye } = Ie, Je = Me[0], Vt = Me[Me.length - 1], En = [], dr = (Ze) => {
      for (const at of Ze) at.page >= Je && at.page <= Vt && En.push({ path: at.path, page: Je + Math.min(at.page - Je, Ye.length - 1), top: at.top }), dr(at.children);
    };
    try {
      dr(e.doc.outline());
    } catch {
    }
    try {
      await e.mutate(Me.length === 1 ? `Replace page ${Je + 1}` : `Replace pages ${Je + 1}-${Vt + 1}`, { pages: "all", structure: true }, async () => {
        const Ze = pa(e.doc);
        if (!e.doc.importIndices(R, Ye, Je)) throw new Error(`${g.name} could not be inserted`);
        const at = xr(R, Ye, e.doc, Je, Ze);
        for (let Ft = Vt + Ye.length; Ft >= Je + Ye.length; Ft--) e.doc.deletePage(Ft);
        for (const Ft of En) try {
          e.doc.retargetBookmark(Ft.path, Ft.page, Ft.top ?? void 0);
        } catch {
        }
        if (at.length) {
          const Ft = await Ar(t, e.doc.save(), at);
          e.replaceDoc(Ft.save()), Ft.close();
        }
      }), H(`Replaced ${Me.length === 1 ? "page " + (Je + 1) : `pages ${Je + 1}–${Vt + 1}`} with ${Ye.length} page${Ye.length === 1 ? "" : "s"} from ${g.name}`), e.selectedPages = new Set(Ye.map((Ze, at) => Je + at)), h.mark(), r.scrollToPage(Je);
    } catch (Ze) {
      H(Ze.message, "err", 5e3);
    } finally {
      R.close();
    }
  }
  async function Le(g, S) {
    const I = S ?? (e.selectedPages.size ? Math.max(...e.selectedPages) + 1 : e.doc.pageCount), R = [];
    try {
      for (const L of g) {
        const j = await Rt(L, "insert pages from");
        if (!j) {
          R.forEach((F) => F.doc.close());
          return;
        }
        R.push({ f: L, doc: j });
      }
    } catch (L) {
      R.forEach((j) => j.doc.close()), H(L.message, "err", 5e3);
      return;
    }
    await Ut(R.map(({ f: L, doc: j }) => ({ name: L.name, doc: j })), I, "Insert pages", g.length === 1 ? g[0].name : g.length + " files");
  }
  async function Ut(g, S, I, R) {
    let L = 0;
    try {
      await e.mutate(I, { pages: "all", structure: true }, async () => {
        let j = S;
        const F = [];
        for (const { name: K, doc: se } of g) try {
          const te = se.pageCount, re = pa(e.doc);
          if (!e.doc.importAll(se, j)) throw new Error(`${K} could not be inserted`);
          F.push(...xr(se, [...Array(te).keys()], e.doc, j, re)), j += te, L += te;
        } finally {
          se.close();
        }
        if (F.length) {
          const K = await Ar(t, e.doc.save(), F);
          e.replaceDoc(K.save()), K.close();
        }
      });
    } catch (j) {
      return g.forEach((F) => F.doc.close()), H(j.message, "err", 5e3), false;
    }
    return H(`Inserted ${L} page${L === 1 ? "" : "s"} from ${R} as page${L === 1 ? "" : "s"} ${S + 1}${L > 1 ? "–" + (S + L) : ""}`), e.selectedPages = new Set(Array.from({ length: L }, (j, F) => S + F)), h.mark(), r.scrollToPage(S), true;
  }
  const St = () => e.selectedPages.size ? [...e.selectedPages].sort((g, S) => g - S) : [e.currentPage];
  function Qe(g) {
    const { locked: S, perms: I } = e.limits;
    if (S && !(I & 16)) return H("This PDF’s permissions don’t allow copying. Unlock it with its permissions password first.", "warn", 5e3), null;
    const R = Math.random().toString(36).slice(2, 10), L = e.fileName, j = g.length, F = cu({ id: R, pages: j, from: L });
    return (async () => {
      let K = t.create();
      try {
        if (!K.importIndices(e.doc, g, 0)) throw new Error("Those pages could not be copied");
        const se = xr(e.doc, g, K, 0, /* @__PURE__ */ new Set());
        if (se.length) {
          const ie = await Ar(t, K.save(), se);
          K.close(), K = ie;
        }
        const te = await ou({ id: R, bytes: K.save(), pages: j, from: L, at: Date.now() }), re = `${j === 1 ? "Page " + (g[0] + 1) : j + " pages"} copied`;
        H(te ? `${re}. Paste with Ctrl+V here or in another Margin window.` : `${re}. Paste with Ctrl+V in this window (this browser won’t let Margin windows share them).`), Ct();
      } catch (se) {
        H(se.message, "err");
      } finally {
        K.close();
      }
    })(), F;
  }
  async function f(g, S) {
    const I = await Pr();
    if (!I) return H("No copied pages yet. Select pages in the sidebar and press Ctrl+C (or Copy).", "warn", 4500);
    if (g && I.id !== g) return H("Those copied pages are no longer available: copy them again.", "warn");
    let R;
    try {
      R = t.open(I.bytes);
    } catch (j) {
      return H(j.message, "err");
    }
    const L = S ?? Math.max(...St()) + 1;
    await Ut([{ name: I.from, doc: R }], L, I.pages === 1 ? "Paste page" : "Paste pages", I.from);
  }
  const Ct = () => Pr().then((g) => {
    const S = document.querySelector('.page-actions [data-act="paste"]');
    S && (S.disabled = !g, S.title = g ? `Paste ${g.pages} copied page${g.pages === 1 ? "" : "s"} from ${g.from} after the selected page` : "Paste copied pages (copy pages first)");
  });
  au(() => Ct()), Ct();
  async function wt(g, S, I, R) {
    e.selectedPages.has(g) || (e.selectedPages = /* @__PURE__ */ new Set([g]), h.mark());
    const L = St(), j = e.doc.pageCount, F = L[0], K = L[L.length - 1], { locked: se, perms: te } = e.limits, re = !se || !!(te & 8), ie = !se || !!(te & 16), me = await Pr(), pe = L.length === 1 ? `Page ${F + 1}` : `${L.length} pages`, Ie = me ? `${me.pages} page${me.pages === 1 ? "" : "s"}` : "";
    pn(S, I, [{ heading: L.length === 1 ? pe : `${pe} (${ln(L)})` }, { label: "Copy", shortcut: "Ctrl+C", disabled: !ie, run: () => ve("copy") }, { label: me ? `Paste ${Ie} after` : "Paste after", shortcut: "Ctrl+V", disabled: !me || !re, run: () => f(null, K + 1) }, { label: me ? `Paste ${Ie} before` : "Paste before", disabled: !me || !re, run: () => f(null, F) }, "sep", { label: "Rotate left", disabled: !re, run: () => ve("rotl") }, { label: "Rotate right", disabled: !re, run: () => ve("rotr") }, { label: "Insert blank page after", disabled: !re, run: () => ve("insert") }, { label: "Insert pages from PDF…", disabled: !re, run: () => {
      ae = K + 1, Y.click();
    } }, { label: L.length === 1 ? "Replace with page from PDF…" : "Replace with pages from PDF…", disabled: !re, run: () => ne.click() }, "sep", { label: "Extract…", disabled: !ie, run: () => ve("extract") }, { label: "Export as images…", disabled: !ie, run: () => ee() }, { label: L.length === 1 ? "Delete page" : `Delete ${L.length} pages`, shortcut: "Del", danger: true, disabled: !re || L.length >= j, run: () => ve("delete") }, ...L.length === 1 ? ["sep", { label: "Go to page", run: () => r.scrollToPage(F) }] : []], R);
  }
  const Dn = { "246,214,74": "Yellow", "134,222,140": "Green", "120,196,246": "Blue", "246,150,198": "Pink", "250,172,92": "Orange", "24,26,33": "Black", "214,69,52": "Red", "37,99,235": "Blue", "22,140,82": "Green", "124,77,219": "Purple" }, jn = [null, [255, 255, 255, 255], [255, 249, 196, 255], [219, 234, 254, 255], [220, 252, 231, 255], [252, 231, 243, 255]], yn = (g) => Dn[g.slice(0, 3).join(",")] || (g[0] + g[1] + g[2] > 740 ? "White" : "Color");
  function zt(g, S, I, R, L = false) {
    const j = !!I && !S.some((F) => F && Gn(F, I)), F = I ? "#" + I.slice(0, 3).map((K) => K.toString(16).padStart(2, "0")).join("") : "";
    return { label: g, disabled: L, swatches: [...S.map((K) => ({ css: K ? `rgb(${K[0]},${K[1]},${K[2]})` : "none", label: K ? yn(K) : "None", on: K ? !!I && Gn(K, I) : !I })), { custom: true, css: j ? `rgb(${I[0]},${I[1]},${I[2]})` : void 0, value: F, label: "Custom colour…", on: j }], pick: (K, se) => R(se || S[K]) };
  }
  function bt(g, S, I, R, L = false) {
    return { label: g, disabled: L, swatches: S.map((j) => ({ text: j.text, label: j.label, on: I(j.v) })), pick: (j) => R(S[j].v) };
  }
  const Bn = (g, S, I, R) => e.mutate(R, { pages: [g] }, () => e.doc.setAnnotStyle(g, S, I)).catch((L) => H(L.message, "err"));
  function be(g, S, I) {
    const R = [], L = S.subtype;
    if (L === Q.FREETEXT) {
      const ie = S.ft ? e.doc.readFreeText(g, S.index) : null;
      if (!ie) return R;
      const me = (pe, Ie) => i.update(g, S.index, (Me) => ({ ...Me, style: { ...Me.style, ...pe } }), Ie);
      return R.push(zt("Text", lt.pen, ie.style.color, (pe) => me({ color: pe }, "Text color"), !I), zt("Fill", jn, ie.style.fill, (pe) => me({ fill: pe }, "Text box fill"), !I), zt("Border", [null, ...lt.pen], ie.style.border, (pe) => me({ border: pe }, "Text box border"), !I), bt("Size", [9, 11, 14, 18, 24].map((pe) => ({ text: String(pe), label: `${pe} pt`, v: pe })), (pe) => Math.abs(ie.style.size - pe) < 0.01, (pe) => me({ size: pe }, "Text size"), !I)), R;
    }
    if (L === Q.SQUARE || L === Q.CIRCLE) {
      // a shape keeps an outline or a fill: removing the last one is refused
      const ie = e.doc.annotStyle(g, S.index);
      R.push(zt("Outline", [null, ...lt.pen], S.color, (me) => !me && !ie?.fill ? H("A shape needs an outline or a fill", "warn") : e.mutate(me ? "Outline colour" : "Remove outline", { pages: [g] }, () => e.doc.setAnnotColor(g, S.index, me)).catch((pe) => H(pe.message, "err")), !I));
    } else if (L !== Q.STAMP && S.color) {
      const ie = lt.highlight.some((me) => Gn(me, S.color)) || L === 9 || L === 1 ? lt.highlight : lt.pen;
      R.push(zt("Color", ie, S.color, (me) => e.mutate("Change color", { pages: [g] }, () => e.doc.setAnnotColor(g, S.index, me)).catch((pe) => H(pe.message, "err")), !I));
    }
    const j = L === Q.SQUARE || L === Q.CIRCLE, F = L === Q.LINE, K = L === Q.INK, se = L >= 9 && L <= 12;
    if (!j && !F && !K && !se) return R;
    const te = e.doc.annotStyle(g, S.index);
    if (!te) return R;
    const re = (ie, me) => Bn(g, S.index, ie, me);
    if (j && R.push(zt("Fill", [null, [255, 255, 255, 255], ...lt.highlight], te.fill, (ie) => !ie && !S.color ? H("A shape needs an outline or a fill", "warn") : re({ fill: ie }, ie ? "Fill shape" : "Remove fill"), !I)), (j || F || K) && R.push(bt("Width", [1, 2, 4, 8].map((ie) => ({ text: String(ie), label: `${ie} pt`, v: ie })), (ie) => Math.abs(te.width - ie) < 0.26, (ie) => re({ width: ie }, "Line width"), !I), bt("Style", [{ text: "Solid", label: "Solid line", v: false }, { text: "Dashed", label: "Dashed line", v: true }], (ie) => ie === te.dashed, (ie) => re({ dashed: ie }, ie ? "Dashed line" : "Solid line"), !I)), F && te.ends) {
      const ie = te.ends, me = ie[1] !== "None" ? ie[1] : ie[0] !== "None" ? ie[0] : "OpenArrow", pe = (ie[0] !== "None" ? 1 : 0) | (ie[1] !== "None" ? 2 : 0);
      R.push(bt("Arrows", [{ text: "—", label: "No arrowheads", v: 0 }, { text: "→", label: "Arrowhead at the end", v: 2 }, { text: "←", label: "Arrowhead at the start", v: 1 }, { text: "↔", label: "Arrowheads at both ends", v: 3 }], (Ie) => Ie === pe, (Ie) => re({ ends: [Ie & 1 ? me : "None", Ie & 2 ? me : "None"] }, "Arrowheads"), !I)), pe && R.push(bt("Heads", [{ text: "Open", label: "Open arrowheads", v: "OpenArrow" }, { text: "Filled", label: "Filled arrowheads", v: "ClosedArrow" }], (Ie) => Ie === me, (Ie) => re({ ends: [ie[0] !== "None" ? Ie : "None", ie[1] !== "None" ? Ie : "None"] }, "Arrowhead style"), !I)), (pe === 1 || pe === 2) && R.push({ label: "Reverse direction", disabled: !I, run: () => e.mutate("Reverse arrow", { pages: [g] }, () => e.doc.reverseLine(g, S.index)).catch((Ie) => H(Ie.message, "err")) });
    }
    return R.push(bt("Opacity", [100, 75, 50, 25, 10].map((ie) => ({ text: ie + "%", label: `${ie}% opaque`, v: ie / 100 })), (ie) => Math.abs(te.opacity - ie) < 0.03, (ie) => re({ opacity: ie }, "Opacity"), !I)), R;
  }
  const je = () => {
    const { locked: g, perms: S } = e.limits;
    return !g || !!(S & 8) || !!(S & 32);
  }, mt = () => {
    const { locked: g, perms: S } = e.limits;
    return !g || !!(S & 8);
  };
  async function wn(g, S) {
    const I = a.itemOfAnnot(g, S);
    if (!I) {
      H("Couldn’t find that annotation to duplicate", "err");
      return;
    }
    const R = await a.duplicate(g, [I]);
    e.tool === "select" && R[0]?.startsWith("a") && (e.selectedAnnot = { page: g, index: +R[0].slice(1) }, o.refreshOverlays(), m.markSelected(), V());
  }
  const Qt = (g, S, I) => e.mutate(I === "front" ? "Bring to front" : "Send to back", { pages: [g] }, () => {
    if (!e.doc.restackAnnots(g, [S], I)) throw new Error(I === "front" ? "Already in front of what it overlaps" : "Already behind what it overlaps");
  }).then(() => {
    e.selectedAnnot = null, o.refreshOverlays(), V();
  }).catch((R) => H(R.message, "warn")), vn = /* @__PURE__ */ new Set([Q.TEXT, Q.FREETEXT, Q.LINE, Q.SQUARE, Q.CIRCLE, Q.INK, Q.STAMP]), cn = Math.random().toString(36).slice(2, 10), xn = () => cn + "|" + e.fileName;
  let ct = { id: "", page: -1, n: 0 }, Mt = false, un = false;
  const st = () => {
    const { locked: g, perms: S } = e.limits;
    return !g || !!(S & 16);
  };
  function en() {
    if (e.tool === "arrange" && a.sel && !a.cropping) {
      const g = a.selected();
      return g.length ? { page: a.sel.page, items: g } : null;
    }
    if (e.tool === "select" && e.selectedAnnot) {
      const g = a.itemOfAnnot(e.selectedAnnot.page, e.selectedAnnot.index);
      return g ? { page: e.selectedAnnot.page, items: [g] } : null;
    }
    return null;
  }
  function rt(g = false) {
    const S = en();
    if (!S) return null;
    if (!st()) return H("This PDF’s permissions don’t allow copying. Unlock it with its permissions password first.", "warn", 5e3), null;
    if (g && !(e.tool === "arrange" ? mt() : je())) return H("This PDF’s permissions don’t allow removing objects", "warn"), null;
    const I = a.clipOf(S.page, S.items);
    if (!I) return H("Only annotations and pictures can be copied", "warn"), null;
    const R = Math.random().toString(36).slice(2, 10), L = e.fileName, j = I.items.length, F = { id: R, items: I.items, bounds: I.bounds, count: j, from: L, src: xn(), page: S.page, at: Date.now() };
    ct = { id: R, page: S.page, n: 0 };
    const K = j === 1 ? S.items.length === 1 ? S.items[0].label : "Object" : `${j} objects`;
    if (su(F).then((se) => {
      const te = I.skipped ? ` ${I.skipped} other${I.skipped === 1 ? "" : "s"} (text, links, form fields or markup) can’t be copied.` : "";
      H(`${K} ${g ? "cut" : "copied"}. Paste with Ctrl+V on any page${se ? ", here or in another Margin window" : ""}.${te}`, I.skipped ? "warn" : "ok", I.skipped ? 4500 : 2800);
    }), g) {
      const se = S.items.filter((te) => a.canDuplicate(te));
      a.removeItems(S.page, se, se.length > 1 ? `Cut ${se.length} objects` : `Cut ${se[0].label.toLowerCase()}`).then(() => {
        e.selectedAnnot = null, o.refreshOverlays(), V();
      }).catch((te) => H(te.message, "err"));
    }
    return iu(F);
  }
  function ut(g) {
    Mt = g, un = false;
    try {
      document.execCommand("copy");
    } catch {
    }
    if (Mt = false, !un) {
      const S = rt(g);
      S && navigator.clipboard?.writeText(S).catch(() => {
      });
    }
  }
  async function ht(g, S) {
    const I = await Kn();
    if (!I) return H("Nothing copied yet. Select an annotation or picture and press Ctrl+C.", "warn", 4e3);
    if (g && I.id !== g) return H("Those copied objects are no longer available: copy them again.", "warn");
    if (!(I.items.some((Ye) => Ye.t === "img") ? mt() : je())) return H("This PDF’s permissions don’t allow adding these", "warn");
    const L = S?.page ?? (e.tool === "arrange" && a.sel ? a.sel.page : e.currentPage), j = r.views[L];
    if (!j) return;
    const F = I.bounds;
    let K = 0, se = 0;
    S ? (K = S.p.x - F.l, se = S.p.y - F.t) : I.src === xn() && I.page === L && (ct = ct.id === I.id && ct.page === L ? { ...ct, n: ct.n + 1 } : { id: I.id, page: L, n: 1 }, [K, se] = a.screenOffset(L, 12 * ct.n));
    const te = r.zoom, re = j.w * te, ie = j.h * te, me = j.tf.box({ l: F.l + K, r: F.r + K, t: F.t + se, b: F.b + se });
    let pe = 0, Ie = 0;
    if (me.w <= re && (pe = me.x < 0 ? -me.x : me.x + me.w > re ? re - me.x - me.w : 0), me.h <= ie && (Ie = me.y < 0 ? -me.y : me.y + me.h > ie ? ie - me.y - me.h : 0), pe || Ie) {
      const [Ye, Je] = a.screenOffset(L, pe / te, Ie / te);
      K += Ye, se += Je;
    }
    const Me = await a.paste(L, I.items, K, se, I.count > 1 ? `Paste ${I.count} objects` : "Paste");
    Me.length && (e.tool === "select" && Me.length === 1 && Me[0][0] === "a" ? (e.selectedAnnot = { page: L, index: +Me[0].slice(1) }, o.refreshOverlays(), m.markSelected(), V()) : e.tool !== "arrange" && (e.setTool("arrange"), a.invalidate(L), a.sel = { page: L, key: Me[0] }, a.extra = Me.slice(1), a.refresh(), V()));
  }
  const hn = (g, S) => {
    const I = en(), R = !!I && I.items.some((L) => a.canDuplicate(L));
    return [{ label: "Cut", shortcut: "Ctrl+X", disabled: !R || !st() || !S, run: () => ut(true) }, { label: "Copy", shortcut: "Ctrl+C", disabled: !R || !st(), run: () => ut(false) }, { label: g ? `Paste ${g.count === 1 ? "" : g.count + " objects"}`.trim() : "Paste", shortcut: "Ctrl+V", disabled: !g || !S, run: () => ht() }];
  };
  async function vt(g, S, I, R, L) {
    const j = e.doc.annots(g).find((Me) => Me.index === S);
    if (!j) return;
    const F = await Kn();
    e.selectedAnnot = { page: g, index: S }, o.refreshOverlays(), m.markSelected(), V();
    const K = je(), se = j.subtype >= 9 && j.subtype <= 12, te = j.subtype === 3, re = j.subtype === 13, ie = re && j.contents === "Signature" ? "Signature" : te && j.ft?.tip ? "Callout" : j.subtype === Q.LINE && e.doc.annotStyle(g, S)?.ends?.some((Me) => Me !== "None") ? "Arrow" : Zn[j.subtype] || "Annotation", me = r.views[g], pe = [{ heading: `${ie}${j.author ? " · " + j.author : ""}` }];
    te && o.textbox && me ? pe.push({ label: "Edit text", disabled: !K, run: () => o.textbox.edit(me, S) }) : pe.push({ label: j.contents && !(re && j.contents === "Signature") ? "Edit comment" : "Add comment", disabled: !K, run: () => o.onNoteCreated(g, S) }), pe.push({ label: "Reply", disabled: !K, run: () => {
      document.body.classList.add("show-comments"), m.reply(g, S);
    } }), j.contents && !te && !(re && j.contents === "Signature") && pe.push({ label: "Copy comment text", run: () => navigator.clipboard?.writeText(j.contents).then(() => H("Comment text copied"), () => H("Couldn’t reach the clipboard", "warn")) });
    const Ie = be(g, j, K);
    Ie.length && pe.push("sep", ...Ie), pe.push("sep"), vn.has(j.subtype) && (!te || j.ft) && pe.push(...hn(F, K), { label: "Duplicate", shortcut: "Ctrl+D", disabled: !K, run: () => wn(g, S) }), pe.push({ label: "Bring to front", disabled: !K, run: () => Qt(g, S, "front") }, { label: "Send to back", disabled: !K, run: () => Qt(g, S, "back") }), se || pe.push({ label: "Move & resize", disabled: !K, run: () => {
      e.setTool("arrange"), a.sel = { page: g, key: "a" + S }, a.extra = [], a.refresh(), V();
    } }), pe.push("sep", { label: "Delete", shortcut: "Del", danger: true, disabled: !K, run: () => Lt() }), pn(I, R, pe, L);
  }
  async function xt() {
    const g = a.sel, S = a.current();
    if (!g || !S || S.kind !== "image") return;
    const I = await gs();
    if (I) try {
      const R = await Eo(I, I.name), L = e.doc.imageInfo(g.page, S.objs[0]), j = L ? Math.hypot(L.matrix[0], L.matrix[1]) : 300, F = L ? Math.hypot(L.matrix[2], L.matrix[3]) : 300;
      await a.replaceImage(await Fs(R, j, F), R.w, R.h), R.bitmap.close(), URL.revokeObjectURL(R.url);
    } catch (R) {
      H(R.message, "err");
    }
  }
  async function An() {
    const g = a.sel, S = a.current();
    if (!g || !S || S.kind !== "image") return;
    const { locked: I, perms: R } = e.limits;
    if (I && !(R & 16)) return H("This PDF’s permissions don’t allow copying its content", "warn");
    const L = e.editedName.replace(/\.pdf$/i, "") + `-p${g.page + 1}-image`;
    try {
      const j = e.doc.imageJpeg(g.page, S.objs[0]);
      if (j) return await Ne(j, L + ".jpg", "image/jpeg");
      const F = e.doc.imagePixels(g.page, S.objs[0]);
      if (!F) throw new Error("Couldn’t read that image");
      const K = document.createElement("canvas");
      K.width = F.w, K.height = F.h, K.getContext("2d").putImageData(new ImageData(F.rgba, F.w, F.h), 0, 0);
      const se = await new Promise((te) => K.toBlob(te, "image/png"));
      if (!se) throw new Error("Couldn’t encode the image");
      await Ne(new Uint8Array(await se.arrayBuffer()), L + ".png", "image/png");
    } catch (j) {
      H(j.message, "err");
    }
  }
  async function Gt(g, S, I) {
    const R = await Kn(), L = a.selected(), j = L.length;
    if (!j) return;
    const F = a.sel.page, K = mt(), se = [];
    if (j === 1) {
      const re = L[0];
      se.push({ heading: re.label });
      const ie = re.kind === "annot" ? e.doc.annots(F).find((me) => me.index === re.annot) : void 0;
      if (ie) {
        const me = r.views[F];
        ie.subtype === Q.FREETEXT && o.textbox && me ? se.push({ label: "Edit text", run: () => {
          e.setTool("select"), o.textbox.edit(me, ie.index);
        } }) : se.push({ label: ie.contents ? "Edit comment" : "Add comment", run: () => {
          e.setTool("select"), e.selectedAnnot = { page: F, index: ie.index }, o.refreshOverlays(), o.onNoteCreated(F, ie.index);
        } });
        const pe = be(F, ie, je());
        pe.length && se.push("sep", ...pe);
      } else if (re.label === "Link") {
        const me = o.links?.of(F).find((pe) => pe.index === re.annot);
        me && o.links && se.push({ label: "Edit link…", disabled: !K, run: () => o.links.editDialog(F, me) });
      } else re.kind === "image" && (se.push({ label: "Rotate left", run: () => a.turn("rotl") }, { label: "Rotate right", run: () => a.turn("rotr") }, { label: "Flip horizontally", run: () => a.turn("fliph") }, { label: "Flip vertically", run: () => a.turn("flipv") }), re.label === "Image" && se.push("sep", { label: "Crop", run: () => a.startCrop() }, { label: "Replace image…", run: () => xt() }, { label: "Save image…", run: () => An() }));
      se.push("sep");
    } else se.push({ heading: `${j} objects` });
    const te = (re) => a.align(re);
    se.push(bt(j > 1 ? "Align" : "Align to page", [{ text: "Left", label: j > 1 ? "Align left edges" : "Page’s left edge", v: "left" }, { text: "Centre", label: j > 1 ? "Align centres" : "Centre on the page", v: "hcenter" }, { text: "Right", label: j > 1 ? "Align right edges" : "Page’s right edge", v: "right" }], () => false, te, !K), bt("", [{ text: "Top", label: j > 1 ? "Align tops" : "Page’s top", v: "top" }, { text: "Middle", label: j > 1 ? "Align middles" : "Centre on the page vertically", v: "vmiddle" }, { text: "Bottom", label: j > 1 ? "Align bottoms" : "Page’s bottom", v: "bottom" }], () => false, te, !K)), j >= 3 && se.push({ label: "Distribute across", disabled: !K, run: () => a.distribute("h") }, { label: "Distribute down", disabled: !K, run: () => a.distribute("v") }), j >= 2 && se.push(bt("Match", [{ text: "Width", label: "Match width of the last clicked", v: "w" }, { text: "Height", label: "Match height of the last clicked", v: "h" }, { text: "Both", label: "Match size of the last clicked", v: "both" }], () => false, (re) => a.matchSize(re), !K)), se.push("sep", { label: "Bring to front", shortcut: "Ctrl+Shift+]", disabled: !K, run: () => a.restack("front") }, { label: "Bring forward", shortcut: "Ctrl+]", disabled: !K, run: () => a.restack("forward") }, { label: "Send backward", shortcut: "Ctrl+[", disabled: !K, run: () => a.restack("backward") }, { label: "Send to back", shortcut: "Ctrl+Shift+[", disabled: !K, run: () => a.restack("back") }, "sep", ...hn(R, K), { label: j > 1 ? `Duplicate ${j}` : "Duplicate", shortcut: "Ctrl+D", disabled: !K || !L.some((re) => a.canDuplicate(re)), run: () => a.duplicate(F) }, { label: j > 1 ? `Delete ${j} objects` : "Delete", shortcut: "Del", danger: true, disabled: !K, run: () => a.remove() }), pn(g, S, se, I);
  }
  async function At(g, S, I, R) {
    const L = r.views[g];
    if (!L) return;
    const j = await Kn(), F = je(), K = mt();
    e.selectedPages = /* @__PURE__ */ new Set([g]), h.mark();
    const se = [{ heading: `Page ${g + 1}` }];
    e.tool === "arrange" && se.push({ label: "Select all objects", shortcut: "Ctrl+A", run: () => {
      a.sel = null, e.currentPage = g, a.selectAll(), V();
    } }, "sep"), j && se.push({ label: j.count === 1 ? "Paste here" : `Paste ${j.count} objects here`, shortcut: "Ctrl+V", disabled: !(j.items.some((te) => te.t === "img") ? K : F), run: () => ht(null, { page: g, p: R }) }, "sep"), se.push({ label: "Add note here", disabled: !F, run: () => {
      e.setTool("select"), o.noteDown(L, R);
    } }, { label: "Add text box here", disabled: !F || !o.textbox, run: () => {
      e.setTool("select"), o.textbox.edit(L, null, { box: { l: R.x, r: R.x + 200, t: R.y, b: R.y - e.settings.ftSize * 2.2 }, text: "", style: o.textbox.style() });
    } }, "sep", { label: "Copy page", shortcut: "Ctrl+C", run: () => ve("copy") }, { label: "Rotate page left", disabled: !K, run: () => ve("rotl") }, { label: "Rotate page right", disabled: !K, run: () => ve("rotr") }, { label: "Insert blank page after", disabled: !K, run: () => ve("insert") }, "sep", { label: "Delete page", danger: true, disabled: !K || e.doc.pageCount <= 1, run: () => ve("delete") }), pn(S, I, se);
  }
  function Be(g, S, I, R, L) {
    const j = o.links?.of(g).find((re) => re.index === S);
    if (!j || !o.links) return;
    const { locked: F, perms: K } = e.limits, se = !F || !!(K & 8), te = j.uri ? j.uri : j.page != null && j.page >= 0 ? `page ${j.page + 1}` : "nowhere";
    pn(I, R, [{ heading: `Link to ${te.length > 40 ? te.slice(0, 39) + "…" : te}` }, { label: j.uri ? "Open link" : "Go to page", disabled: !j.uri && !(j.page != null && j.page >= 0), run: () => o.links.follow(j) }, ...j.uri ? [{ label: "Copy link address", run: () => {
      navigator.clipboard?.writeText(j.uri).then(() => H("Link address copied"), () => H("Couldn’t reach the clipboard", "warn"));
    } }] : [], "sep", { label: "Edit link…", disabled: !se, run: () => o.links.editDialog(g, j) }, { label: "Remove link", danger: true, disabled: !se, run: () => e.mutate("Remove link", { pages: [g] }, () => e.doc.deleteAnnot(g, j.index)).catch((re) => H(re.message, "err")) }], L);
  }
  r.el.addEventListener("contextmenu", (g) => {
    if (e.tool !== "select" && e.tool !== "arrange" || M(g.target)) return;
    const S = g.target, I = S.closest(".page");
    if (!I) return;
    const R = +I.dataset.index, L = r.views[R];
    if (!L) return;
    if (e.tool === "arrange") {
      if (a.cropping) return;
      g.preventDefault();
      const K = S.closest("[data-k]")?.dataset.k;
      K ? (a.sel?.page === R && (a.sel.key === K || a.extra.includes(K)) || (a.sel = { page: R, key: K }, a.extra = [], a.refresh(), V()), Gt(g.clientX, g.clientY)) : S.closest(".ogroup") && a.sel?.page === R ? Gt(g.clientX, g.clientY) : (a.sel && a.clear(), At(R, g.clientX, g.clientY, r.toPage(L, g)));
      return;
    }
    if (window.getSelection()?.toString()) return;
    const j = S.closest(".abox"), F = S.closest(".lbox");
    if (g.preventDefault(), j) vt(R, +j.dataset.annot, g.clientX, g.clientY, j);
    else if (F) Be(R, +F.dataset.link, g.clientX, g.clientY, F);
    else {
      if (S.closest(".fld,.sigfld,input,select,button")) return;
      e.selectedAnnot && (e.selectedAnnot = null, o.refreshOverlays(), V()), At(R, g.clientX, g.clientY, r.toPage(L, g));
    }
  }), document.addEventListener("keydown", (g) => {
    if (!(g.key === "ContextMenu" || g.shiftKey && g.key === "F10") || M(g.target) || Zr() || He(g.target)) return;
    if (e.tool === "arrange" && a.sel && !a.cropping) {
      const L = r.views[a.sel.page]?.ov.querySelector(".oframe.primary, .oframe:not(.multi)");
      if (!L) return;
      g.preventDefault();
      const j = L.getBoundingClientRect();
      Gt(j.left + Math.min(j.width, 40), j.bottom + 4);
      return;
    }
    const S = e.selectedAnnot;
    if (!S || e.tool !== "select") return;
    const I = r.views[S.page]?.ov.querySelector(`.abox[data-annot="${S.index}"]`);
    if (!I) return;
    g.preventDefault();
    const R = I.getBoundingClientRect();
    vt(S.page, S.index, R.left + Math.min(R.width, 40), R.bottom + 4, I);
  });
  let qe = null;
  r.el.addEventListener("pointerdown", (g) => {
    if (g.pointerType !== "touch" || e.tool !== "select") return;
    const S = g.target.closest(".abox,.lbox");
    S && (qe = { t: window.setTimeout(() => {
      if (!qe || Zr()) return;
      const R = +qe.el.closest(".page").dataset.index;
      qe.el.classList.contains("abox") ? vt(R, +qe.el.dataset.annot, qe.x, qe.y, qe.el) : Be(R, +qe.el.dataset.link, qe.x, qe.y, qe.el), qe = null;
    }, 550), x: g.clientX, y: g.clientY, el: S });
  }, true);
  const dn = (g) => {
    qe && (g.type !== "pointermove" || Math.hypot(g.clientX - qe.x, g.clientY - qe.y) > 10) && (clearTimeout(qe.t), qe = null);
  };
  for (const g of ["pointermove", "pointerup", "pointercancel"]) r.el.addEventListener(g, dn, true);
  const He = (g) => g?.closest?.(".thumb");
  h.list.addEventListener("contextmenu", (g) => {
    const S = He(g.target);
    S && (g.preventDefault(), wt(+S.dataset.index, g.clientX, g.clientY, S));
  }), h.list.addEventListener("keydown", (g) => {
    const S = He(g.target);
    if (S) if (g.key === "ContextMenu" || g.shiftKey && g.key === "F10") {
      g.preventDefault();
      const I = S.getBoundingClientRect();
      wt(+S.dataset.index, I.left + I.width / 2, I.top + I.height / 2, S);
    } else (g.key === "Delete" || g.key === "Backspace") && !g.metaKey && !g.ctrlKey && (g.preventDefault(), g.stopPropagation(), ve("delete"));
  });
  let et = null;
  h.list.addEventListener("pointerdown", (g) => {
    if (g.pointerType !== "touch") return;
    const S = He(g.target);
    S && (et = { t: window.setTimeout(() => {
      et && !Zr() && wt(+et.el.dataset.index, et.x, et.y, et.el), et = null;
    }, 550), x: g.clientX, y: g.clientY, el: S });
  });
  const Ht = (g) => {
    et && (g.type !== "pointermove" || Math.hypot(g.clientX - et.x, g.clientY - et.y) > 10) && (clearTimeout(et.t), et = null);
  };
  for (const g of ["pointermove", "pointerup", "pointercancel"]) h.list.addEventListener(g, Ht);
  const M = (g) => !!g?.closest?.("input,textarea,select,[contenteditable]") || !!o.editor, he = () => !!document.activeElement?.closest?.("#thumbs");
  document.addEventListener("copy", (g) => {
    if (M(g.target) || document.querySelector(".modal") || window.getSelection()?.toString()) return;
    if (!he() && en()) {
      const R = Mt;
      Mt = false, un = true;
      const L = rt(R);
      L && (g.preventDefault(), g.clipboardData?.setData("text/plain", L));
      return;
    }
    if (!he() && !e.selectedPages.size) return;
    const I = Qe(St());
    I && (g.preventDefault(), g.clipboardData?.setData("text/plain", I));
  });
  async function ve(g) {
    const S = e.doc.pageCount, I = e.selectedPages.size ? [...e.selectedPages].sort((L, j) => L - j) : [e.currentPage], R = I.length > 1 ? `${I.length} pages` : `page ${I[0] + 1}`;
    try {
      if (g === "rotl" || g === "rotr") await e.mutate(`Rotate ${R}`, { pages: I, structure: true }, () => I.forEach((L) => e.doc.rotate(L, g === "rotl" ? -1 : 1)));
      else if (g === "insert") {
        const L = I[I.length - 1], { w: j, h: F } = e.doc.pageSize(L);
        await e.mutate("Insert blank page", { pages: "all", structure: true }, () => e.doc.insertBlank(L + 1, j, F)), e.selectedPages = /* @__PURE__ */ new Set([L + 1]), h.mark(), r.scrollToPage(L + 1);
      } else if (g === "delete") {
        if (I.length >= S) return H("A PDF needs at least one page", "warn");
        if (await nt({ title: `Delete ${R}?`, body: "You can undo this.", actions: [{ id: "no", label: "Cancel" }, { id: "yes", label: "Delete", danger: true }] }) !== "yes") return;
        await e.mutate(`Delete ${R}`, { pages: "all", structure: true }, () => {
          for (const j of [...I].reverse()) e.doc.deletePage(j);
          e.selectedPages.clear();
        });
      } else if (g === "merge") {
        Y.click();
        return;
      } else if (g === "copy") {
        const L = Qe(I);
        L && navigator.clipboard?.writeText(L).catch(() => {
        });
      } else g === "paste" ? await f() : g === "extract" && await Ac(e, t, I, Ne);
    } catch (L) {
      H(L.message, "err");
    }
  }
  async function Re() {
    let g;
    try {
      g = e.exportBytes();
    } catch (S) {
      return H(wo(S) ? Ha : S.message, "err", 8e3), false;
    }
    return await Ne(g, e.editedName), true;
  }
  async function Ne(g, S, I = "application/pdf") {
    const R = await yu();
    if (R) {
      try {
        await R.save({ filename: S, data: new Blob([g], { type: I }) }), S === e.editedName && (e.dirty = false, Oe()), H(`Saved ${S}`);
      } catch (L) {
        L?.code === "declined" ? H("Save cancelled", "warn") : L?.code === "rate_limited" ? H("A save prompt is already open", "warn") : H(`Couldn’t save: ${L?.message || L?.code || "unknown error"}`, "err", 5e3);
      }
      return;
    }
    try {
      const L = URL.createObjectURL(new Blob([g], { type: I })), j = y("a", { href: L, download: S });
      document.body.append(j), j.click(), j.remove(), setTimeout(() => URL.revokeObjectURL(L), 4e3), S === e.editedName && (e.dirty = false, Oe()), H(`Saved ${S}`);
    } catch {
      H("Saving isn’t available in this view", "err");
    }
  }
  async function ot() {
    return await nt({ title: "Discard your changes?", body: `${e.fileName} has edits you haven’t saved.`, actions: [{ id: "no", label: "Keep editing" }, { id: "save", label: "Save first" }, { id: "yes", label: "Discard", danger: true }] }).then(async (g) => g === "save" ? await Re() ? "yes" : "no" : g) === "yes";
  }
  function Lt() {
    const g = e.selectedAnnot;
    g && e.mutate("Delete annotation", { pages: [g.page] }, () => e.doc.deleteAnnot(g.page, g.index)).then(() => {
      e.selectedAnnot = null, V();
    }).catch((S) => H(S.message, "err"));
  }
  function Ae() {
    const g = e.undo();
    g && H(`Undid ${g.toLowerCase()}`);
  }
  function kn() {
    const g = e.redo();
    g && H(`Redid ${g.toLowerCase()}`);
  }
  const Wt = _e("#viewer");
  Wt.addEventListener("dragover", (g) => {
    g.dataTransfer?.types.includes("Files") && (g.preventDefault(), Wt.classList.add("dropping"));
  }), Wt.addEventListener("dragleave", (g) => {
    g.target === Wt && Wt.classList.remove("dropping");
  }), Wt.addEventListener("drop", (g) => {
    Wt.classList.remove("dropping");
    const S = [...g.dataTransfer?.files || []].filter(Zl);
    if (S.length) {
      g.preventDefault();
      const R = g.target.closest(".page"), L = R ? r.views[+R.dataset.index] : void 0;
      o.editor && o.commitEditor(), (async () => {
        for (const [j, F] of S.entries()) await o.placeImageFile(F, L ? { pv: L, clientX: g.clientX + j * 16, clientY: g.clientY + j * 16 } : void 0);
      })();
      return;
    }
    const I = [...g.dataTransfer?.files || []].filter((R) => /pdf$/i.test(R.type) || /\.pdf$/i.test(R.name));
    I.length && (g.preventDefault(), Ke(I[0]));
  }), _e("#thumbs").addEventListener("dragover", (g) => {
    g.dataTransfer?.types.includes("Files") && g.preventDefault();
  }), _e("#thumbs").addEventListener("drop", (g) => {
    const S = [...g.dataTransfer?.files || []].filter((I) => /\.pdf$/i.test(I.name));
    S.length && (g.preventDefault(), Le(S));
  });
  const hr = Object.fromEntries(Object.entries(Jr).map(([g, S]) => [S.key.toLowerCase(), g]));
  document.addEventListener("keydown", (g) => {
    const S = g.target.closest("input,textarea,select,[contenteditable]"), I = g.metaKey || g.ctrlKey;
    if (I && g.key.toLowerCase() === "s") {
      g.preventDefault(), Re();
      return;
    }
    if (g.key === "F7" && !I) {
      g.preventDefault(), o.editor && o.commitEditor(), J.open();
      return;
    }
    if (I && g.key.toLowerCase() === "p") {
      g.preventDefault(), o.editor && o.commitEditor(), Fa(e);
      return;
    }
    if (I && g.key.toLowerCase() === "f") {
      g.preventDefault(), de.focus(), de.select();
      return;
    }
    if (I && g.key.toLowerCase() === "h") {
      g.preventDefault(), Ee(true);
      return;
    }
    if (I && g.key.toLowerCase() === "o") {
      g.preventDefault(), q.click();
      return;
    }
    if (!S) {
      if (I && g.key.toLowerCase() === "z") {
        g.preventDefault(), g.shiftKey ? kn() : Ae();
        return;
      }
      if (I && g.key.toLowerCase() === "y") {
        g.preventDefault(), kn();
        return;
      }
      if (I && (g.key === "=" || g.key === "+")) {
        g.preventDefault(), r.setZoom(r.zoom * 1.2);
        return;
      }
      if (I && g.key === "-") {
        g.preventDefault(), r.setZoom(r.zoom / 1.2);
        return;
      }
      if (I && g.key === "0") {
        g.preventDefault(), r.fit = "width", r.applyFit();
        return;
      }
      if (e.tool === "crop" && s.sel) {
        if (g.key === "Enter") {
          g.preventDefault(), s.apply([s.sel.page]);
          return;
        }
        if (g.key === "Escape") {
          s.sel = null, s.refresh(), V();
          return;
        }
      }
      if (e.tool === "arrange" && a.cropping) {
        if (g.key === "Enter") {
          g.preventDefault(), a.applyCrop(ia);
          return;
        }
        if (g.key === "Escape") {
          g.preventDefault(), a.cancelCrop();
          return;
        }
      }
      if (I && !g.shiftKey && g.key.toLowerCase() === "d") {
        if (e.tool === "arrange" && a.sel && !a.cropping) {
          g.preventDefault(), mt() && a.duplicate(a.sel.page);
          return;
        }
        if (e.tool === "select" && e.selectedAnnot) {
          g.preventDefault(), je() && wn(e.selectedAnnot.page, e.selectedAnnot.index);
          return;
        }
      }
      if (e.tool === "arrange" && !S && I && g.key.toLowerCase() === "a") {
        g.preventDefault(), a.selectAll(), V();
        return;
      }
      if (e.tool === "arrange" && a.sel && I && (g.key === "]" || g.key === "[" || g.code === "BracketRight" || g.code === "BracketLeft")) {
        g.preventDefault();
        const R = g.key === "]" || g.code === "BracketRight";
        a.restack(g.shiftKey ? R ? "front" : "back" : R ? "forward" : "backward");
        return;
      }
      if (e.tool === "arrange" && a.sel) {
        const R = g.shiftKey ? 10 : 1, L = { ArrowLeft: [-R, 0], ArrowRight: [R, 0], ArrowUp: [0, -R], ArrowDown: [0, R] };
        if (L[g.key]) {
          g.preventDefault(), a.nudge(...L[g.key]);
          return;
        }
        if (g.key === "Delete" || g.key === "Backspace") {
          g.preventDefault(), a.remove();
          return;
        }
        if (g.key === "Escape") {
          a.clear(), V();
          return;
        }
      }
      if ((g.key === "Delete" || g.key === "Backspace") && e.selectedAnnot) {
        g.preventDefault(), Lt();
        return;
      }
      if (g.key === "Escape") {
        e.setTool("select");
        return;
      }
      !I && !g.altKey && hr[g.key.toLowerCase()] && e.setTool(hr[g.key.toLowerCase()]);
    }
  }), document.addEventListener("cut", (g) => {
    if (M(g.target) || document.querySelector(".modal") || window.getSelection()?.toString() || he() || !en()) return;
    const S = rt(true);
    S && (g.preventDefault(), g.clipboardData?.setData("text/plain", S));
  }), document.addEventListener("paste", (g) => {
    if (M(g.target) || document.querySelector(".modal")) return;
    const S = [...g.clipboardData?.items || []].find((j) => j.kind === "file" && j.type.startsWith("image/"))?.getAsFile();
    if (S) {
      g.preventDefault(), o.placeImageFile(S);
      return;
    }
    const I = g.clipboardData?.getData("text/plain") || "", R = uu(I), L = lu(I);
    if (he()) {
      g.preventDefault(), f(R);
      return;
    }
    !R && !L && I.trim() || (g.preventDefault(), Promise.all([Pr(), Kn()]).then(([j, F]) => {
      F && (!j || F.at >= j.at) ? ht(L && L === F.id ? L : null) : j ? f(R && R === j.id ? R : null) : L ? ht(L) : R && f(R);
    }));
  }), window.addEventListener("beforeunload", (g) => {
    e.dirty && g.preventDefault();
  });
  try {
    const g = new Uint8Array(await n("welcome.pdf"));
    e.open(g, "Welcome to Margin.pdf");
  } catch {
    const g = t.create();
    g.insertBlank(0, 612, 792), e.open(g.save(), "Untitled.pdf"), g.close();
  }
  e.setTool("select"), _e("#boot").remove(), $t(ze("sarabun")).catch(() => {
  });
}
wu();
const vu = {}, xu = Object.freeze(Object.defineProperty({ __proto__: null, default: vu }, Symbol.toStringTag, { value: "Module" }));
