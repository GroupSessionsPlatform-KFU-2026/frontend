import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { roomsApi } from '@/api/rooms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

interface PomodoroTimerProps {
    isModerator?: boolean;
}

const PomodoroTimer = ({ isModerator = true }: PomodoroTimerProps) => {
    const { roomId } = useParams<{ roomId: string }>();
    const [time, setTime] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [mode, setMode] = useState<'work' | 'break'>('work');
    const [workDuration, setWorkDuration] = useState(25);
    const [breakDuration, setBreakDuration] = useState(5);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const prevTimeRef = useRef(time);

    //загрузка состояния таймера
    useEffect(() => {
        if (!roomId) return;
        const loadPomodoro = async () => {
            try {
                const response = await roomsApi.getPomodoro(roomId);
                if (response.data) {
                    setWorkDuration(response.data.work_duration);
                    setBreakDuration(response.data.short_break_duration);
                    setMode(response.data.current_phase === 'work' ? 'work' : 'break');
                    setIsRunning(response.data.is_running);

                    if (response.data.phase_ends_at) {
                        const endTime = new Date(response.data.phase_ends_at).getTime();
                        const now = Date.now();
                        const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
                        setTime(remaining);
                    } else {
                        setTime(
                            response.data.current_phase === 'work' ? workDuration * 60 : breakDuration * 60
                        );
                    }
                }
            } catch (error) {
                console.error('Ошибка загрузки таймера:', error);
            }
        };
        loadPomodoro();
    }, [roomId]);

    //таймер обратного отсчета
    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;

        if (isRunning && time > 0) {
            interval = setInterval(() => {
                setTime((prev) => prev - 1);
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning]);

    useEffect(() => {
        if (time === 0 && prevTimeRef.current === 1) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setMode(mode === 'work' ? 'break' : 'work');

            setTime(mode === 'work' ? breakDuration * 60 : workDuration * 60);

            setIsRunning(false);
        }
        prevTimeRef.current = time;
    }, [time, mode, workDuration, breakDuration]);

    const applySettings = async () => {
        if (!roomId) return;
        try {
            await roomsApi.updatePomodoroSettings(roomId, {
                work_duration: workDuration,
                short_break_duration: breakDuration,
            });
            if (!isRunning && mode === 'work') {
                setTime(workDuration * 60);
            } else if (!isRunning && mode === 'break') {
                setTime(breakDuration * 60);
            }
            setIsSettingsOpen(false);
        } catch (error) {
            console.error('Ошибка сохранения настроек:', error);
            toast.error('Не удалось сохранить настройки таймера');
        }
    };

    const resetToDefaults = () => {
        setWorkDuration(25);
        setBreakDuration(5);
        setMode('work');
        setTime(25 * 60);
        setIsRunning(false);
    };

    const handleStart = async () => {
        if (!roomId) return;
        try {
            await roomsApi.startPomodoro(roomId);
            setIsRunning(true);
        } catch (error) {
            console.error('Ошибка запуска таймера:', error);
        }
    };

    const handlePause = async () => {
        if (!roomId) return;
        try {
            await roomsApi.pausePomodoro(roomId);
            setIsRunning(false);
        } catch (error) {
            console.error('Ошибка паузы таймера:', error);
        }
    };

    const handleReset = async () => {
        if (!roomId) return;
        try {
            await roomsApi.resetPomodoro(roomId);
            setIsRunning(false);
            setMode('work');
            setTime(workDuration * 60);
        } catch (error) {
            console.error('Ошибка сброса таймера:', error);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-white rounded-lg border p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-sm text-gray-500">
                    {mode === 'work' ? '🍅 Время работать' : '☕ Перерыв'}
                </h3>
                {isModerator && (
                    <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                        <DialogTrigger>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Settings2 className="w-4 h-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Настройки таймера</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="work">Время работы (минуты)</Label>
                                    <Input
                                        id="work"
                                        type="number"
                                        min={1}
                                        max={60}
                                        value={workDuration}
                                        onChange={(e) => setWorkDuration(Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="break">Время перерыва (минуты)</Label>
                                    <Input
                                        id="break"
                                        type="number"
                                        min={1}
                                        max={30}
                                        value={breakDuration}
                                        onChange={(e) => setBreakDuration(Number(e.target.value))}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={applySettings} className="flex-1">
                                        Применить
                                    </Button>
                                    <Button variant="outline" onClick={resetToDefaults} className="flex-1">
                                        Сбросить
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            <div className="text-4xl font-mono font-bold text-center my-2">{formatTime(time)}</div>

            {isModerator ? (
                <div className="flex justify-center gap-2">
                    {!isRunning ? (
                        <Button size="sm" onClick={handleStart}>
                            <Play className="w-4 h-4 mr-1" />
                            Старт
                        </Button>
                    ) : (
                        <Button size="sm" variant="outline" onClick={handlePause}>
                            <Pause className="w-4 h-4 mr-1" />
                            Пауза
                        </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={handleReset}>
                        <RotateCcw className="w-4 h-4" />
                    </Button>
                </div>
            ) : (
                <p className="text-xs text-gray-400 text-center">Таймер управляется модератором</p>
            )}
        </div>
    );
};

export default PomodoroTimer;
