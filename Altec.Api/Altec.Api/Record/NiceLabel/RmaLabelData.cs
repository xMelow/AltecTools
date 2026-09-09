namespace Altec.Api.Record.NiceLabel;

public record RmaLabelData(
    string Language,
    string TicketNumber,
    string Company,
    string ContactPerson,
    string ContactPersonPrefix,
    List<string> DontSendItems,
    string? Overige,
    bool MultiplePrinters,
    string Model,
    string Street,
    string Problem1,
    string? Problem2,
    string Place,
    string SerieNumber,
    string Warranty
);
