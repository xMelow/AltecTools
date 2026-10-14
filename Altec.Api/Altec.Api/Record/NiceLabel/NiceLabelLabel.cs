namespace Altec.Api.Record.NiceLabel;

public record NiceLabelLabel(
    NiceLabelLabelSettings LabelSetting,
    List<string> ConversionIssues,
    List<string> Variables,
    List<string> Functions,
    List<string> LabelObjects,
    NiceLabelDataSet DataSet,
    string FilePath,
    string Author,
    string Title
);

public record NiceLabelLabelSettings(
    int Width,
    int Height,
    string OriginalPrinterName,
    string OriginalPrinterDriver,
    NiceLabelLabelPageLayout PageLayout
);

public record NiceLabelLabelPageLayout(
    int MediaWidth,
    int MediaHeight,
    int Columns,
    int Rows,
    int HorizontalGap,
    int VerticalGap,
    int HorizontalOffset,
    int VerticalOffset,
    int HorizontalRadius,
    int VerticalRadius
);

public record NiceLabelDataSet(
    bool IsFileDatabase,
    string FileDatabaseFileName,
    string ConnectionString,
    string TableName,
    bool IsCustomSql,
    string CustomSql,
    List<string> Fields
);
