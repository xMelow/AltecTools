using Altec.Api.Records;

namespace Altec.Api.Domain.Tspl;

public class TsplParser
{
    private IReadOnlyList<string> commandsToParse = new[]
    {
        "SIZE", "BAR", "BOX", "TEXT", "BARCODE", "QRCODE", "CIRCLE", "PUTBMP", "BLOCK",
        "DIRECTION"
    };
    
    public IReadOnlyList<TsplDrawCommand> Parse(string tspl)
    {
        var result = new List<TsplDrawCommand>();
        string[] lines = tspl.Split(new[] { "\r\n", "\n" }, StringSplitOptions.None);
        
        for (int i = 0; i < lines.Length; i++)
        {
            var trimmedLine = lines[i].Trim();
            var name = trimmedLine.Split(" ")[0];
            if (commandsToParse.Contains(name))
            {
                result.Add(ParseTsplLine(trimmedLine, i+1));
            }
        }
        return result;
    }

    private TsplDrawCommand ParseTsplLine(string line, int lineNumber)
    {
        int firstSpace = line.IndexOf(" ");
        var name = line[..firstSpace];
        
        if (firstSpace == -1) return new TsplDrawCommand(name, lineNumber, new List<string>());
        
        return new TsplDrawCommand(name, lineNumber, ParseParameters(line[firstSpace..].Trim()));
    }

    private IReadOnlyList<string> ParseParameters(string arguments)
    {
        var tokens = Tokenize(arguments);
        return tokens.Select(RemoveMetrics).ToList();
    }

    private List<string> Tokenize(string arguments)
    {
        var result = new List<string>();
        string currentParam = "";
        bool inQuotes = false;

        foreach (var character in arguments)
        {
            if (character == '\"')
            {
                inQuotes = !inQuotes;
                continue;
            }
            
            if (character == ',' && !inQuotes)
            {
                result.Add(currentParam.Trim());
                currentParam = "";
            }
            else
                currentParam += character;
        }
        
        if (!string.IsNullOrEmpty(currentParam)) 
            result.Add(currentParam.Trim());
        
        return result;
    }

    private string RemoveMetrics(string parameter)
    {
        return parameter.Replace(" mm", "").Trim();
    }
}