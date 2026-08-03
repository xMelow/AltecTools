using Altec.Api.Records;
using DocumentFormat.OpenXml.Drawing;
using DocumentFormat.OpenXml.InkML;
using SkiaSharp;
using ZXing;
using ZXing.Common;
using ZXing.SkiaSharp.Rendering;

namespace Altec.Api.Domain.Tspl;

public class TsplRender
{
    private const double PrinterDpi = 300.0;
    private const double ScreenDpi = 96.0;

    private static readonly SKTypeface LabelTypeface = SKTypeface.FromFile("./Resource/Fonts/RobotoCondensed-Variable.ttf") ?? SKTypeface.Default;

    public byte[] Render(IReadOnlyList<TsplDrawCommand> commands, bool showBlockOutline, Dictionary<string, string> images)
    {
        var sizeCommand = commands.FirstOrDefault(command => command.Name == "SIZE")
            ?? throw new TsplRenderException(0, "SIZE command must be present");

        int width;
        int height;

        try
        {
            RequireArguments(sizeCommand, 1);
            width = Mm2Pixels(int.Parse(sizeCommand.Arguments[0]));
            height = Mm2Pixels(int.Parse(sizeCommand.Arguments[1]));
        }
        catch (Exception ex) when (ex is System.FormatException || ex is ArgumentException)
        {
            throw new TsplRenderException(sizeCommand.LineNumber, ex);
        }

        return CreateBitMap(width, height, commands, showBlockOutline, images);
    }

    private int Mm2Pixels(int mm)
    {
        var dots = (mm / 25.4) * PrinterDpi;
        return Convert.ToInt32(Dots2Pixels((int) dots));
    }
    
    private byte[] CreateBitMap(int width, int height, IReadOnlyList<TsplDrawCommand> commands, bool showBlockOutline, Dictionary<string, string> images)
    {
        SKBitmap bitmap = new SKBitmap(width, height);
        using var canvas = new SKCanvas(bitmap);
        canvas.Clear(SKColors.White);

        var directionCommand = commands.FirstOrDefault(command => command.Name == "DIRECTION");
        if (directionCommand != null) 
        {
            try
            {
                RotateBitMap(directionCommand, canvas, width, height);
            }
            catch (Exception ex)
            {
                throw new TsplRenderException(directionCommand.LineNumber, ex);
            }
        }
        
        foreach (var command in commands)
        {
            try
            {
                switch (command.Name)
                {
                    case "TEXT":
                        DrawTextCommand(command, canvas);
                        break;
                    case "BAR":
                        DrawBarCommand(command, canvas);
                        break;
                    case "BOX":
                        DrawBoxCommand(command, canvas);
                        break;
                    case "CIRCLE":
                        DrawCircleCommand(command, canvas);
                        break;
                    case "BARCODE":
                        DrawBarcodeCommand(command, canvas);
                        break;
                    case "QRCODE":
                        DrawQrcodeCommand(command, canvas);
                        break;
                    case "PUTBMP":
                        DrawBmpCommand(command, canvas, images);
                        break;
                    case "BLOCK":
                        DrawBlockCommand(command, canvas, showBlockOutline);
                        break;
                }
            }
            catch (Exception ex)
            {
                throw new TsplRenderException(command.LineNumber, ex);
            }
        }
        using var image = SKImage.FromBitmap(bitmap);
        using var data = image.Encode(SKEncodedImageFormat.Png, 100);
        
        return data.ToArray();
    }

    private void RotateBitMap(TsplDrawCommand command, SKCanvas canvas, int width, int height)
    {
        RequireArguments(command, 1);
        var direction = int.Parse(command.Arguments[0]);
        var mirror = int.Parse(command.Arguments[1]);
        var xPivot = width / 2f;
        var yPivot = height / 2f;

        if (direction == 1) canvas.RotateDegrees(180, xPivot, yPivot);
        if (mirror == 1)
        {
            canvas.Translate(width, 0);
            canvas.Scale(-1, 1);
        }   
    }

    private float Dots2Pixels(int dots)
    {
        return Convert.ToSingle(dots * (ScreenDpi / PrinterDpi));
    }
    
    private void DrawTextCommand(TsplDrawCommand command, SKCanvas canvas)
    {  
        RequireArguments(command, 6);      
        const double baseDotHeight = 3.6;
        var x = Dots2Pixels(int.Parse(command.Arguments[0]));
        var y = Dots2Pixels(int.Parse(command.Arguments[1]));
        var yScale = int.Parse(command.Arguments[5]);
        var fontSize = Dots2Pixels((int)(baseDotHeight * yScale));
        var rotation = int.Parse(command.Arguments[3]);
        var text = command.Arguments[^1];

        using var paint = new SKPaint
        {
            Color = SKColors.Black,
            IsAntialias = true
        };

        using var font = new SKFont
        {
            Typeface = LabelTypeface,
            Size = fontSize,
            Embolden = true
        };
        
        var textBounds = new SKRect();
        paint.MeasureText(text, ref textBounds);
        var yBaseline = y + textBounds.Height;

        canvas.Save();
        if (rotation > 0)
            canvas.RotateDegrees(rotation, x, y);
        
        canvas.DrawText(text, x, yBaseline, font, paint);
        canvas.Restore();
    }
    
    private void DrawBarCommand(TsplDrawCommand command, SKCanvas canvas)
    {
        RequireArguments(command, 3);
        var x = Dots2Pixels(int.Parse(command.Arguments[0]));
        var y = Dots2Pixels(int.Parse(command.Arguments[1]));
        var width = Dots2Pixels(int.Parse(command.Arguments[2]));
        var height = Dots2Pixels(int.Parse(command.Arguments[3]));

        using var paint = new SKPaint
        {
            Color = SKColors.Black,
            Style = SKPaintStyle.Fill
        };
        
        canvas.DrawRect(x, y, width, height, paint);
    }
    
    private void DrawBoxCommand(TsplDrawCommand command, SKCanvas canvas)
    {
        RequireArguments(command, 4);
        var x = Dots2Pixels(int.Parse(command.Arguments[0]));
        var y = Dots2Pixels(int.Parse(command.Arguments[1]));
        var xEnd = Dots2Pixels(int.Parse(command.Arguments[2]));
        var yEnd = Dots2Pixels(int.Parse(command.Arguments[3]));
        var width = xEnd - x;
        var height = yEnd - y;
        float radius = 0;

        if (command.Arguments.Count > 5) radius = Dots2Pixels(int.Parse(command.Arguments[5]));

        using var paint = new SKPaint
        {
            Color = SKColors.Black,
            Style = SKPaintStyle.Stroke,
            StrokeWidth = Dots2Pixels(int.Parse(command.Arguments[4]))
        };

        canvas.DrawRoundRect(x, y, width, height, radius, radius, paint);
    }

    private void DrawCircleCommand(TsplDrawCommand command, SKCanvas canvas)
    {
        RequireArguments(command, 3);
        var x = Dots2Pixels(int.Parse(command.Arguments[0]));
        var y = Dots2Pixels(int.Parse(command.Arguments[1]));
        var diameter = Dots2Pixels(int.Parse(command.Arguments[2]));
        var radius = diameter / 2;
        var centerX = x + radius;
        var centerY = y + radius;

        using var paint = new SKPaint
        {
            Color = SKColors.Black,
            Style = SKPaintStyle.Stroke,
            StrokeWidth = Dots2Pixels(int.Parse(command.Arguments[3]))
        };
        
        canvas.DrawCircle(centerX, centerY, diameter / 2, paint);
    }

    private void DrawBlockCommand(TsplDrawCommand command, SKCanvas canvas, bool showBlockOutline)
    {
        var (x, y, width, height, rotation, fontSize, align, text) = ParseBlockArguments(command);
    
        using var paint = new SKPaint { Color = SKColors.Black, IsAntialias = true };
        using var font = new SKFont { Typeface = LabelTypeface, Size = fontSize, Embolden = true };

        canvas.Save();

        if (rotation > 0)
            canvas.RotateDegrees(rotation, x, y);

        DrawWrappedText(canvas, font, paint, text, x, y, width, fontSize, rotation, align);
        
        if (showBlockOutline)
            DrawBlockOutline(canvas, x, y, width, height);

        canvas.Restore();
    }

    private (float x, float y, float width, float height, float rotation, float fontSize, int algin, string text) ParseBlockArguments(TsplDrawCommand command)
    {
        RequireArguments(command, 8);
        const double baseDotHeight = 3.6;
        var x = Dots2Pixels(int.Parse(command.Arguments[0]));
        var y = Dots2Pixels(int.Parse(command.Arguments[1]));
        var width = Dots2Pixels(int.Parse(command.Arguments[2]));
        var height = Dots2Pixels(int.Parse(command.Arguments[3]));
        var rotation = int.Parse(command.Arguments[5]);
        var yScale = int.Parse(command.Arguments[7]);
        var text = command.Arguments[^1];
        var fontSize = Dots2Pixels((int)(baseDotHeight * yScale));
        var align = command.Arguments.Count >= 11
            ? int.Parse(command.Arguments[9])
            : 0;
        
        return (x, y, width, height, rotation, fontSize, align, text);
    } 

    private void DrawWrappedText(SKCanvas canvas, SKFont font, SKPaint paint, string text, float x, float y,
        float blockWidth, float fontSize, float rotation, int align)
    {
        var currentLine = "";
        font.GetFontMetrics(out var metrics);
        var yCursor = y + Math.Abs(metrics.Ascent) * 0.7f;
        
        foreach (var word in text.Split(" "))
        {
            if (font.MeasureText(currentLine + word) >= blockWidth)
            {
                var drawX = align == 2
                    ? x + (blockWidth - font.MeasureText(currentLine)) / 2
                    : x;
                canvas.DrawText(currentLine, drawX, yCursor, font, paint);
                yCursor += fontSize * 1.2f;
                currentLine = word + " ";
            }
            else
                currentLine += word + " ";
        }
        if (!string.IsNullOrEmpty(currentLine))
        {
            var drawX = align == 2
                ? x + (blockWidth - font.MeasureText(currentLine)) / 2
                : x;
            canvas.DrawText(currentLine, drawX, yCursor, font, paint);
        }
    }

    private void DrawBlockOutline(SKCanvas canvas, float x, float y, float blockWidth, float blockHeight)
    {
        using var outlinePaint = new SKPaint
        {
            Color = SKColors.Red,
            Style = SKPaintStyle.Stroke,
            StrokeWidth = 1
        };
        canvas.DrawRect(x, y, blockWidth, blockHeight, outlinePaint);
    }
    
    private void DrawQrcodeCommand(TsplDrawCommand command, SKCanvas canvas)
    {
        RequireArguments(command, 6);
        const int qrGridCells = 25;
        var x = Dots2Pixels(int.Parse(command.Arguments[0]));
        var y = Dots2Pixels(int.Parse(command.Arguments[1]));
        var content = command.Arguments[^1];
        var cellWidth = int.Parse(command.Arguments[3]);
        var rotation = int.Parse(command.Arguments[5]);
        var size = Dots2Pixels(cellWidth * qrGridCells);

        var writer = new BarcodeWriter<SKBitmap>
        {
            Format = BarcodeFormat.QR_CODE,
            Options = new EncodingOptions
            {
                Width = (int)size,
                Height = (int)size,
                Margin = 1
            },
            Renderer = new SKBitmapRenderer()
        };
        var qrBitmap = writer.Write(content);
        canvas.Save();
        
        if (rotation > 0)
            canvas.RotateDegrees(rotation, x, y);
        
        canvas.DrawBitmap(qrBitmap, x, y);
        canvas.Restore();
    }
    
    private void DrawBarcodeCommand(TsplDrawCommand command, SKCanvas canvas)
    {
        var (x, y, height, showText, textAlign, rotation, narrow, content, barcodeFormat) = ParseBarcodeArguments(command);
        
        var writer = new BarcodeWriter<SKBitmap>
        {
            Format = barcodeFormat,
            Options = new EncodingOptions
            {
                Height = (int)height,
                Margin = 1,
                PureBarcode = true
            },
            Renderer = new SKBitmapRenderer()
        };

        var naturalMatrix = writer.Encode(content);
        writer.Options.Width = (int)(naturalMatrix.Width * narrow);

        var barcodeBitMap = writer.Write(content);
        canvas.Save();
        
        if (rotation > 0)
            canvas.RotateDegrees(rotation, x, y);
        
        if (showText)
        {
            using var paint = new SKPaint
            {
                Color = SKColors.Black,
                IsAntialias = true,
                TextAlign = textAlign
            };

            using var font = new SKFont
            {
                Typeface = LabelTypeface,
                Size = 12
            };

            var textBounds = new SKRect();
            paint.MeasureText(content, ref textBounds);

            var textX = textAlign switch
            {
                SKTextAlign.Left => x,
                SKTextAlign.Right => x + barcodeBitMap.Width,
                SKTextAlign.Center => x + barcodeBitMap.Width / 2,
                _ => x
            };
            var textY = y + barcodeBitMap.Height + textBounds.Height;

            canvas.DrawText(content, textX, textY, font, paint);
        }
        
        canvas.DrawBitmap(barcodeBitMap, x, y);
        canvas.Restore();
    }

    private (float x, float y, float height, bool showText, SKTextAlign textAlign, int rotation, float narrow, string content, BarcodeFormat barcodeFormat) ParseBarcodeArguments(TsplDrawCommand command)
    {
        RequireArguments(command, 7);
        var x = Dots2Pixels(int.Parse(command.Arguments[0]));
        var y = Dots2Pixels(int.Parse(command.Arguments[1]));
        var barcodeType = command.Arguments[2];
        var height = Dots2Pixels(int.Parse(command.Arguments[3]));
        var (showText, textAlign) = int.Parse(command.Arguments[4]) switch
        {
            1 => (true, SKTextAlign.Left),
            2 => (true, SKTextAlign.Center),
            3 => (true, SKTextAlign.Right),
            _ => (false, SKTextAlign.Center),
        };
        var rotation = int.Parse(command.Arguments[5]);
        var narrow = Dots2Pixels(int.Parse(command.Arguments[6]));
        var content = command.Arguments[^1];
        var barcodeFormat = barcodeType switch
        {
            "128" => BarcodeFormat.CODE_128,
            "39" => BarcodeFormat.CODE_39,
            "EAN13" => BarcodeFormat.EAN_13,
            "EAN8" => BarcodeFormat.EAN_8,
            _ => BarcodeFormat.CODE_128
        };
        
        return (x, y, height, showText, textAlign, rotation, narrow, content, barcodeFormat);
    }
    
    private void DrawBmpCommand(TsplDrawCommand command, SKCanvas canvas, Dictionary<string, string> images)
    {
        RequireArguments(command, 2);
        var filename = command.Arguments[2];
        
        if (!images.ContainsKey(filename)) return;

        var x = Dots2Pixels(int.Parse(command.Arguments[0]));
        var y = Dots2Pixels(int.Parse(command.Arguments[1]));

        var imageBytes = Convert.FromBase64String(images[filename]);
        var bitmap = SKBitmap.Decode(imageBytes);

        var scaledWidth = (int)(bitmap.Width * (ScreenDpi / PrinterDpi));
        var scaledHeight = (int)(bitmap.Height * (ScreenDpi / PrinterDpi));

        var scaledBitmap = bitmap.Resize(new SKImageInfo(scaledWidth, scaledHeight), SKFilterQuality.High);
    
        canvas.DrawBitmap(scaledBitmap, x, y);
    }

    private void RequireArguments(TsplDrawCommand command, int highestIndex)
    {
        var minCount = ++highestIndex;
        if (command.Arguments.Count < minCount)
            throw new ArgumentException($"{command.Name} requires at least {minCount} arguments, got {command.Arguments.Count}");
    }
}
