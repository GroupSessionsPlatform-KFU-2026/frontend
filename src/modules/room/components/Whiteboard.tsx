import { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Line, Circle, Rect, Text as KonvaText } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { Button } from '@/components/ui/button';
import {
    Eraser,
    Pen,
    Trash2,
    Palette,
    Pin,
    Square,
    Type,
    Circle as CircleIcon,
    Square as SquareIcon,
    X,
} from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const USE_MOCK = true;

interface LineData {
    id: string;
    points: number[];
    color: string;
    strokeWidth: number;
}

interface MarkerData {
    id: string;
    x: number;
    y: number;
    text: string;
    isAnonymous: boolean;
    authorId?: number;
    hasAnswers: boolean;
}

interface ShapeData {
    id: string;
    type: 'circle' | 'rect';
    x: number;
    y: number;
    width: number;
    height: number;
    radius?: number;
    color: string;
}

interface TextData {
    id: string;
    x: number;
    y: number;
    text: string;
    fontSize: number;
    color: string;
}

interface CommentData {
    id: string;
    text: string;
    authorId: number;
    authorName: string;
    isAnonymous: boolean;
    createdAt: string;
}

type Tool = 'brush' | 'eraser' | 'marker' | 'shape' | 'text';

const Whiteboard = ({ roomId }: { roomId: string }) => {
    const [lines, setLines] = useState<LineData[]>([]);
    const [currentLine, setCurrentLine] = useState<LineData | null>(null);
    const [markers, setMarkers] = useState<MarkerData[]>([]);
    const [shapes, setShapes] = useState<ShapeData[]>([]);
    const [texts, setTexts] = useState<TextData[]>([]);
    const [tool, setTool] = useState<Tool>('brush');
    const [penColor, setPenColor] = useState('#000000');
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
    const [isMarkerDialogOpen, setIsMarkerDialogOpen] = useState(false);
    const [markerPosition, setMarkerPosition] = useState({ x: 0, y: 0 });
    const [markerText, setMarkerText] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
    const [editingMarker, setEditingMarker] = useState<MarkerData | null>(null);
    const [editMarkerText, setEditMarkerText] = useState('');
    const [markerComments, setMarkerComments] = useState<Record<string, CommentData[]>>({});
    const [newComment, setNewComment] = useState('');
    const [isCommentAnonymous, setIsCommentAnonymous] = useState(false);
    const [shapeType, setShapeType] = useState<'circle' | 'rect'>('circle');
    const [editingTextId, setEditingTextId] = useState<string | null>(null);
    const [editTextValue, setEditTextValue] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const isDrawing = useRef(false);
    const [isDraggingShape, setIsDraggingShape] = useState(false);
    const [currentShape, setCurrentShape] = useState<ShapeData | null>(null);
    const [isAddingText, setIsAddingText] = useState(false);
    const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
    const [textInput, setTextInput] = useState('');
    const [textSize, setTextSize] = useState(16);
    const [selectedTextId, setSelectedTextId] = useState<string | null>(null);

    const currentUserId = Number(localStorage.getItem('user_id')) || 1;
    const userName = localStorage.getItem('user_name') || 'Пользователь';

    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setStageSize({ width: width - 10, height: height - 10 });
            }
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const clearBoard = () => {
        setLines([]);
        setMarkers([]);
        setShapes([]);
        setTexts([]);
        setMarkerComments({});
    };

    const getColor = () => (tool === 'eraser' ? '#ffffff' : penColor);
    const getStrokeWidth = () => (tool === 'eraser' ? 20 : 2);

    const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        const pos = e.target.getStage()?.getPointerPosition();
        if (!pos) return;

        if (tool === 'marker') {
            setMarkerPosition(pos);
            setIsMarkerDialogOpen(true);
            return;
        }

        if (tool === 'shape') {
            setIsDraggingShape(true);
            setCurrentShape({
                id: Date.now().toString(),
                type: shapeType,
                x: pos.x,
                y: pos.y,
                width: 0,
                height: 0,
                radius: 0,
                color: penColor,
            });
            return;
        }

        if (tool === 'text') {
            setTextPosition(pos);
            setIsAddingText(true);
            return;
        }

        if (tool === 'brush' || tool === 'eraser') {
            isDrawing.current = true;
            const newLine: LineData = {
                id: Date.now().toString(),
                points: [pos.x, pos.y],
                color: getColor(),
                strokeWidth: getStrokeWidth(),
            };
            setCurrentLine(newLine);
        }
    };

    const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
        const pos = e.target.getStage()?.getPointerPosition();
        if (!pos) return;

        if (isDraggingShape && currentShape) {
            const width = pos.x - currentShape.x;
            const height = pos.y - currentShape.y;
            setCurrentShape({
                ...currentShape,
                width: Math.abs(width),
                height: Math.abs(height),
                radius: Math.min(Math.abs(width), Math.abs(height)) / 2,
                x: width < 0 ? pos.x : currentShape.x,
                y: height < 0 ? pos.y : currentShape.y,
            });
            return;
        }

        if (!isDrawing.current || !currentLine) return;
        const updatedLine = {
            ...currentLine,
            points: [...currentLine.points, pos.x, pos.y],
        };
        setCurrentLine(updatedLine);
    };

    const handleMouseUp = () => {
        if (isDraggingShape && currentShape && currentShape.width > 0 && currentShape.height > 0) {
            setShapes((prev) => [...prev, currentShape]);
        }
        if (currentLine && currentLine.points.length > 2) {
            setLines((prev) => [...prev, currentLine]);
        }
        setCurrentLine(null);
        setCurrentShape(null);
        isDrawing.current = false;
        setIsDraggingShape(false);
    };

    const addMarker = () => {
        if (!markerText.trim()) return;
        const newMarker: MarkerData = {
            id: Date.now().toString(),
            x: markerPosition.x,
            y: markerPosition.y,
            text: markerText,
            isAnonymous: isAnonymous,
            authorId: isAnonymous ? undefined : currentUserId,
            hasAnswers: false,
        };
        setMarkers((prev) => [...prev, newMarker]);
        setMarkerText('');
        setIsAnonymous(false);
        setIsMarkerDialogOpen(false);
        setTool('brush');
    };

    const updateMarker = () => {
        if (!editingMarker || !editMarkerText.trim()) return;
        setMarkers((prev) =>
            prev.map((m) => (m.id === editingMarker.id ? { ...m, text: editMarkerText } : m))
        );
        setEditingMarker(null);
        setEditMarkerText('');
    };

    const deleteMarker = (markerId: string) => {
        setMarkers((prev) => prev.filter((m) => m.id !== markerId));
        setMarkerComments((prev) => {
            const newComments = { ...prev };
            delete newComments[markerId];
            return newComments;
        });
    };

    const addComment = () => {
        if (!newComment.trim() || !selectedMarker) return;

        const comment: CommentData = {
            id: Date.now().toString(),
            text: newComment,
            authorId: currentUserId,
            authorName: isCommentAnonymous ? 'Аноним' : userName,
            isAnonymous: isCommentAnonymous,
            createdAt: new Date().toISOString(),
        };

        setMarkerComments((prev) => ({
            ...prev,
            [selectedMarker.id]: [...(prev[selectedMarker.id] || []), comment],
        }));

        setMarkers((prev) =>
            prev.map((m) => (m.id === selectedMarker.id ? { ...m, hasAnswers: true } : m))
        );

        setNewComment('');
        setIsCommentAnonymous(false);
    };

    const addText = () => {
        if (!textInput.trim()) return;
        const newText: TextData = {
            id: Date.now().toString(),
            x: textPosition.x,
            y: textPosition.y,
            text: textInput,
            fontSize: textSize,
            color: penColor,
        };
        setTexts((prev) => [...prev, newText]);
        setTextInput('');
        setIsAddingText(false);
    };

    const updateText = () => {
        if (editingTextId && editTextValue.trim()) {
            setTexts((prev) =>
                prev.map((t) => (t.id === editingTextId ? { ...t, text: editTextValue } : t))
            );
        }
        setEditingTextId(null);
        setEditTextValue('');
        setSelectedTextId(null);
    };
    //TODO: вызвать удаление текста
    const deleteText = (textId: string) => {
        setTexts((prev) => prev.filter((t) => t.id !== textId));
        setSelectedTextId(null);
    };

    const canEditMarker = (marker: MarkerData | null) => {
        if (!marker) return false;
        return !marker.isAnonymous && marker.authorId === currentUserId;
    };

    const getMarkerColor = (marker: MarkerData | null) => {
        if (!marker) return '#ef4444';
        if (marker.hasAnswers) return '#22c55e';
        if (canEditMarker(marker)) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div ref={containerRef} className="w-full h-full bg-white rounded-lg border shadow-sm relative">
            {USE_MOCK && (
                <div className="absolute top-4 right-4 z-20 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                    Тестовый режим
                </div>
            )}

            {/* Панель инструментов */}
            <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 bg-white rounded-lg shadow-md p-2">
                <Button
                    size="sm"
                    variant={tool === 'brush' ? 'default' : 'outline'}
                    onClick={() => setTool('brush')}
                >
                    <Pen className="w-4 h-4" />
                </Button>

                <Button
                    size="sm"
                    variant={tool === 'marker' ? 'default' : 'outline'}
                    onClick={() => setTool('marker')}
                >
                    <Pin className="w-4 h-4" />
                    <span className="ml-1 text-xs">Маркер</span>
                </Button>

                <div className="flex items-center gap-1">
                    <Button
                        size="sm"
                        variant={tool === 'shape' ? 'default' : 'outline'}
                        onClick={() => setTool('shape')}
                    >
                        {shapeType === 'circle' ? (
                            <CircleIcon className="w-4 h-4" />
                        ) : (
                            <SquareIcon className="w-4 h-4" />
                        )}
                    </Button>
                    <Select
                        value={shapeType}
                        onValueChange={(value: 'circle' | 'rect' | null) => {
                            if (value) setShapeType(value);
                        }}
                    >
                        <SelectTrigger className="w-20 h-8">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="circle">Круг</SelectItem>
                            <SelectItem value="rect">Квадрат</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button
                    size="sm"
                    variant={tool === 'text' ? 'default' : 'outline'}
                    onClick={() => setTool('text')}
                >
                    <Type className="w-4 h-4" />
                </Button>

                <div className="relative">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        disabled={tool === 'eraser'}
                        style={{ backgroundColor: tool !== 'eraser' ? penColor : undefined }}
                    >
                        <Palette className="w-4 h-4" />
                    </Button>
                    {showColorPicker && tool !== 'eraser' && (
                        <div className="absolute top-full mt-2 left-0 z-20">
                            <div className="bg-white rounded-lg shadow-lg p-2">
                                <HexColorPicker color={penColor} onChange={setPenColor} />
                            </div>
                        </div>
                    )}
                </div>

                <Button
                    size="sm"
                    variant={tool === 'eraser' ? 'default' : 'outline'}
                    onClick={() => setTool('eraser')}
                >
                    <Eraser className="w-4 h-4" />
                </Button>

                <Button size="sm" variant="destructive" onClick={clearBoard}>
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>

            <Stage
                width={stageSize.width}
                height={stageSize.height}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{ backgroundColor: '#ffffff', borderRadius: '8px' }}
            >
                <Layer>
                    {/* Линии */}
                    {lines.map((line) => (
                        <Line
                            key={line.id}
                            points={line.points}
                            stroke={line.color}
                            strokeWidth={line.strokeWidth}
                            tension={0.5}
                            lineCap="round"
                            lineJoin="round"
                            strokeScaleEnabled={false}
                        />
                    ))}
                    {currentLine && (
                        <Line
                            points={currentLine.points}
                            stroke={currentLine.color}
                            strokeWidth={currentLine.strokeWidth}
                            tension={0.5}
                            lineCap="round"
                            lineJoin="round"
                            strokeScaleEnabled={false}
                        />
                    )}

                    {/* Текущая рисуемая фигура */}
                    {currentShape &&
                        (currentShape.type === 'circle' ? (
                            <Circle
                                x={currentShape.x + currentShape.width / 2}
                                y={currentShape.y + currentShape.height / 2}
                                radius={currentShape.radius || currentShape.width / 2}
                                stroke={currentShape.color}
                                strokeWidth={2}
                                fill="transparent"
                            />
                        ) : (
                            <Rect
                                x={currentShape.x}
                                y={currentShape.y}
                                width={currentShape.width}
                                height={currentShape.height}
                                stroke={currentShape.color}
                                strokeWidth={2}
                                fill="transparent"
                            />
                        ))}

                    {/* Фигуры */}
                    {shapes.map((shape) =>
                        shape.type === 'circle' ? (
                            <Circle
                                key={shape.id}
                                x={shape.x + shape.width / 2}
                                y={shape.y + shape.height / 2}
                                radius={shape.radius || shape.width / 2}
                                stroke={shape.color}
                                strokeWidth={2}
                                fill="transparent"
                                draggable
                                onDragEnd={(e: KonvaEventObject<DragEvent>) => {
                                    const newX = e.target.x() - shape.width / 2;
                                    const newY = e.target.y() - shape.height / 2;
                                    setShapes((prev) =>
                                        prev.map((s) => (s.id === shape.id ? { ...s, x: newX, y: newY } : s))
                                    );
                                }}
                            />
                        ) : (
                            <Rect
                                key={shape.id}
                                x={shape.x}
                                y={shape.y}
                                width={shape.width}
                                height={shape.height}
                                stroke={shape.color}
                                strokeWidth={2}
                                fill="transparent"
                                draggable
                                onDragEnd={(e: KonvaEventObject<DragEvent>) => {
                                    setShapes((prev) =>
                                        prev.map((s) =>
                                            s.id === shape.id ? { ...s, x: e.target.x(), y: e.target.y() } : s
                                        )
                                    );
                                }}
                            />
                        )
                    )}

                    {/* Текст */}
                    {texts.map((text) => (
                        <KonvaText
                            key={text.id}
                            x={text.x}
                            y={text.y}
                            text={text.text}
                            fontSize={text.fontSize}
                            fill={text.color}
                            draggable
                            onDragEnd={(e: KonvaEventObject<DragEvent>) => {
                                setTexts((prev) =>
                                    prev.map((t) =>
                                        t.id === text.id ? { ...t, x: e.target.x(), y: e.target.y() } : t
                                    )
                                );
                            }}
                            onClick={() => {
                                setSelectedTextId(text.id);
                                setEditingTextId(text.id);
                                setEditTextValue(text.text);
                            }}
                            stroke={selectedTextId === text.id ? '#3b82f6' : undefined}
                            strokeWidth={selectedTextId === text.id ? 2 : 0}
                            padding={selectedTextId === text.id ? 5 : 0}
                        />
                    ))}

                    {/* Маркеры */}
                    {markers.map((marker) => (
                        <Circle
                            key={marker.id}
                            x={marker.x}
                            y={marker.y}
                            radius={12}
                            fill={getMarkerColor(marker)}
                            stroke="white"
                            strokeWidth={2}
                            onClick={() => setSelectedMarker(marker)}
                            onTap={() => setSelectedMarker(marker)}
                            onContextMenu={(e) => {
                                e.evt.preventDefault();
                                if (canEditMarker(marker)) {
                                    setEditingMarker(marker);
                                    setEditMarkerText(marker.text);
                                }
                            }}
                        />
                    ))}
                </Layer>
            </Stage>

            {/* Диалог редактирования текста */}
            <Dialog
                open={!!editingTextId}
                onOpenChange={() => {
                    setEditingTextId(null);
                    setEditTextValue('');
                    setSelectedTextId(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Редактировать текст</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            value={editTextValue}
                            onChange={(e) => setEditTextValue(e.target.value)}
                            placeholder="Введите текст..."
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                if (editingTextId) deleteText(editingTextId);
                                setEditingTextId(null);
                                setEditTextValue('');
                                setSelectedTextId(null);
                            }}
                        >
                            Удалить
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setEditingTextId(null);
                                setEditTextValue('');
                                setSelectedTextId(null);
                            }}
                        >
                            Отмена
                        </Button>
                        <Button onClick={updateText}>Сохранить</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* диалог редактирования маркера */}
            <Dialog open={!!editingMarker} onOpenChange={() => setEditingMarker(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Редактировать маркер</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            value={editMarkerText}
                            onChange={(e) => setEditMarkerText(e.target.value)}
                            placeholder="Введите вопрос..."
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingMarker(null)}>
                            Отмена
                        </Button>
                        <Button onClick={updateMarker}>Сохранить</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* диалог добавления маркера */}
            <Dialog open={isMarkerDialogOpen} onOpenChange={setIsMarkerDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Добавить маркер</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="question">Вопрос или комментарий</Label>
                            <Input
                                id="question"
                                value={markerText}
                                onChange={(e) => setMarkerText(e.target.value)}
                                placeholder="Напишите свой вопрос здесь..."
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="anonymous"
                                checked={isAnonymous}
                                onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                            />
                            <label
                                htmlFor="anonymous"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Отправить анонимно
                            </label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsMarkerDialogOpen(false)}>
                            Отмена
                        </Button>
                        <Button onClick={addMarker}>Добавить</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* диалог добавления текста */}
            <Dialog open={isAddingText} onOpenChange={setIsAddingText}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Добавить текст</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="text">Текст</Label>
                            <Input
                                id="text"
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                placeholder="Введите текст..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="size">Размер шрифта</Label>
                            <Input
                                id="size"
                                type="number"
                                min={10}
                                max={72}
                                value={textSize}
                                onChange={(e) => setTextSize(Number(e.target.value))}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddingText(false)}>
                            Отмена
                        </Button>
                        <Button onClick={addText}>Добавить</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* диалог просмотра маркера и ответов */}
            <Dialog
                open={!!selectedMarker}
                onOpenChange={() => {
                    setSelectedMarker(null);
                    setNewComment('');
                }}
            >
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Вопрос</DialogTitle>
                    </DialogHeader>

                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-gray-50 p-4 rounded-lg flex-1">
                            <p className="text-gray-700">{selectedMarker?.text}</p>
                            <p className="text-xs text-gray-400 mt-2">
                                {selectedMarker?.isAnonymous ? 'Анонимно' : `Автор: ${userName}`}
                            </p>
                        </div>
                        {canEditMarker(selectedMarker!) && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 ml-2"
                                onClick={() => {
                                    if (selectedMarker) deleteMarker(selectedMarker.id);
                                    setSelectedMarker(null);
                                }}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>

                    <div className="space-y-3 mb-4">
                        <h4 className="font-semibold text-sm">
                            Ответы ({markerComments[selectedMarker?.id || '']?.length || 0})
                        </h4>
                        {(markerComments[selectedMarker?.id || ''] || []).map((comment) => (
                            <div key={comment.id} className="bg-white border rounded-lg p-3">
                                <p className="text-sm text-gray-700">{comment.text}</p>
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-xs text-gray-400">
                                        {comment.isAnonymous ? 'Аноним' : comment.authorName}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(comment.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {(!markerComments[selectedMarker?.id || ''] ||
                            markerComments[selectedMarker?.id || ''].length === 0) && (
                            <p className="text-sm text-gray-400 text-center py-4">Пока нет ответов</p>
                        )}
                    </div>

                    <div className="border-t pt-4">
                        <Label htmlFor="comment" className="text-sm font-medium mb-2 block">
                            Ваш ответ
                        </Label>
                        <Input
                            id="comment"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Напишите ответ..."
                            className="mb-3"
                        />
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="comment-anonymous"
                                    checked={isCommentAnonymous}
                                    onCheckedChange={(checked) => setIsCommentAnonymous(checked as boolean)}
                                />
                                <label htmlFor="comment-anonymous" className="text-sm font-medium leading-none">
                                    Анонимно
                                </label>
                            </div>
                            <Button onClick={addComment} disabled={!newComment.trim()}>
                                Ответить
                            </Button>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedMarker(null)}>
                            Закрыть
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Whiteboard;