import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Eraser, Download, Image, Palette } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/components/ui/use-toast";
import PageLayout from "@/components/layouts/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const colorPalette = [
  "#000000", // Black
  "#FF0000", // Red
  "#0000FF", // Blue
  "#008000", // Green
  "#FFA500", // Orange
  "#800080", // Purple
  "#FFFF00", // Yellow
  "#FFC0CB", // Pink
];

const Drawing = () => {
  const { updateProgress } = useUser();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(3);
  const [drawCount, setDrawCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.strokeStyle = currentColor;
    context.lineWidth = lineWidth;
    context.lineCap = 'round';
    setCtx(context);

    // Make it responsive
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      canvas.width = container.clientWidth - 40; // Padding
      canvas.height = 400;
      context.strokeStyle = currentColor;
      context.lineWidth = lineWidth;
      context.lineCap = 'round';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [currentColor, lineWidth]);

  useEffect(() => {
    if (ctx) {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = lineWidth;
    }
  }, [currentColor, lineWidth, ctx]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setDrawCount(prev => prev + 1);
      
      if (drawCount > 0 && drawCount % 5 === 0) {
        updateProgress("drawing", 15);
        toast({
          title: "Art achievement!",
          description: "Your creative skills are growing!",
          variant: "default"
        });
      }
    }
    
    setIsDrawing(false);
    if (ctx) ctx.beginPath();
  };

  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const downloadDrawing = () => {
    if (!canvasRef.current) return;
    updateProgress("drawing", 5);
    
    const link = document.createElement('a');
    link.download = 'my-drawing.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
    
    toast({
      title: "Drawing saved!",
      description: "Your artwork has been downloaded.",
    });
  };

  return (
    <PageLayout title="Drawing & Art">
      <div className="space-y-6">
        <Tabs defaultValue="draw" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="draw">Free Drawing</TabsTrigger>
            <TabsTrigger value="coloring">Coloring Pages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="draw" className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex gap-4">
                <Button
                  onClick={clearCanvas}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Eraser className="w-4 h-4" />
                  Clear
                </Button>
                <Button
                  onClick={downloadDrawing}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Save
                </Button>
              </div>
              
              <div className="flex-1 flex items-center gap-2 justify-end">
                <Palette className="w-4 h-4 text-gray-500" />
                <div className="flex gap-1">
                  {colorPalette.map((color) => (
                    <button
                      key={color}
                      className={`w-6 h-6 rounded-full border ${currentColor === color ? 'ring-2 ring-primary' : 'ring-0'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setCurrentColor(color)}
                    ></button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-5">
              <canvas
                ref={canvasRef}
                className="border border-gray-200 rounded-lg cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Line Width:</span>
              <input
                type="range"
                min="1"
                max="20"
                value={lineWidth}
                onChange={(e) => setLineWidth(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-medium">{lineWidth}px</span>
            </div>
          </TabsContent>
          
          <TabsContent value="coloring" className="space-y-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <Image className="h-10 w-10 mx-auto mb-2 text-gray-500" />
                <p className="text-gray-600">Coming soon!</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <Image className="h-10 w-10 mx-auto mb-2 text-gray-500" />
                <p className="text-gray-600">Coming soon!</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <Image className="h-10 w-10 mx-auto mb-2 text-gray-500" />
                <p className="text-gray-600">Coming soon!</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center text-gray-600">
          <p>Express your creativity! Draw anything you like.</p>
          {drawCount > 0 && (
            <p className="text-sm mt-2 text-primary">You've created {drawCount} drawings!</p>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Drawing;
