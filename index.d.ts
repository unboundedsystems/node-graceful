export default class Graceful {
    private static DEADLY_SIGNALS;
    static exitOnDouble: boolean;
    static timeout: number;
    private static _captureExceptions;
    private static _captureRejections;
    private static listeners;
    private static isRegistered;
    private static isExiting;
    private static exceptionListener;
    private static rejectionListener;
    private static signalsListeners;
    static get captureExceptions(): boolean;
    static set captureExceptions(newValue: boolean);
    static get captureRejections(): boolean;
    static set captureRejections(newValue: boolean);
    static on(signal: 'exit', listener: GracefulListener): GracefulSubscription;
    static off(signal: 'exit', listener: GracefulListener): void;
    static clear(): void;
    static exit(code?: number | string, signal?: string): void;
    private static onDeadlyEvent;
    private static invokeListener;
    private static updateRegistration;
    private static killProcess;
}
export declare type GracefulListener = (signal: string, details?: object) => (void | any | Promise<any> | Promise<void> | Promise<Error>);
export declare type GracefulSubscription = () => void;
