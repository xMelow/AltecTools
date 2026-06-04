namespace Altec.Api.Domain.Printers;

public static class PrinterCommands
{
      public static string GetAllSettings() => string.Join("\r\n",
            "OUT \"MODEL=\";GETSETTING$(\"SYSTEM\",\"INFORMATION\",\"MODEL\")",
            "OUT \"SERIAL=\";GETSETTING$(\"SYSTEM\",\"INFORMATION\",\"SERIAL\")",
            "OUT \"VERSION=\";GETSETTING$(\"SYSTEM\",\"INFORMATION\",\"VERSION\")",
            "OUT \"CHECK SUM=\";GETSETTING$(\"SYSTEM\",\"INFORMATION\",\"CHECKSUM\")",
            "OUT \"DPI=\";GETSETTING$(\"SYSTEM\",\"INFORMATION\",\"DPI\")",
            "OUT \"PRINTER STATUS=\";GETSETTING$(\"SYSTEM\",\"INFORMATION\",\"PRINTER STATUS\")",
            "OUT \"MILAGE=\";GETSETTING$(\"SYSTEM\",\"RECORD\",\"MILAGE\")",
            "OUT \"LABEL COUNTER=\";GETSETTING$(\"SYSTEM\",\"RECORD\",\"LABEL COUNTER\")",
            "OUT \"CUT COUNTER=\";GETSETTING$(\"SYSTEM\",\"RECORD\",\"CUT COUNTER\")",
            "OUT \"MAC ADDRESS NET=\";GETSETTING$(\"CONFIG\",\"NET\",\"MAC ADDRESS\")",
            "OUT \"IP ADDRESS NET=\";GETSETTING$(\"CONFIG\",\"NET\",\"IP ADDRESS\")",
            "OUT \"NAME=\";GETSETTING$(\"CONFIG\",\"NET\",\"NAME\")",
            "OUT \"SENSOR TYPE=\";GETSETTING$(\"CONFIG\",\"SENSOR\",\"SENSOR TYPE\")",
            "OUT \"HEAD OPEN SENSOR=\";GETSETTING$(\"CONFIG\",\"SENSOR\",\"CARRIAGE\")",
            "OUT \"GAP SIZE=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"GAP SIZE\")",
            "OUT \"GAP OFFSET=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"GAP OFFSET\")",
            "OUT \"BLINE SIZE=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"BLINE SIZE\")",
            "OUT \"POST PRINT=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"PRINT MODE\")",
            "OUT \"SPEED=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"SPEED\")",
            "OUT \"DENSITY=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"DENSITY\")", 
            "OUT \"PAPER SIZE=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"PAPER SIZE\")",
            "OUT \"PAPER WIDTH=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"PAPER WIDTH\")",
            "OUT \"DIRECTION=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"DIRECTION\")",
            "OUT \"MIRROR=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"MIRROR\")",
            "OUT \"RIBBON=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"RIBBON\")",
            "OUT \"OFFSET=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"OFFSET\")",
            "OUT \"SHIFT X=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"SHIFT X\")",
            "OUT \"SHIFT Y=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"SHIFT Y\")",
            "OUT \"REFERENCE X=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"REFERENCE X\")",
            "OUT \"REFERENCE Y=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"REFERENCE Y\")",
            "OUT \"COUNTRY CODE=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"COUNTRY CODE\")",
            "OUT \"CODEPAGE=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"CODEPAGE\")",
            "END"
      );

      public static string GetBasicInfo() => string.Join("\r\n",
            "OUT \"NAME=\";GETSETTING$(\"CONFIG\",\"NET\",\"NAME\")",
            "OUT \"MODEL=\";GETSETTING$(\"SYSTEM\",\"INFORMATION\",\"MODEL\")",
            "END"
      );

      public const string Ping = "~!T\r\n";
}