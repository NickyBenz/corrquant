import { BehaviorSubject } from 'rxjs';

const subject = new BehaviorSubject();

export const MarketDataService = {
    sendMessage: message => subject.next({ message : message}),
    clearMessages: () => subject.next(),
    getMessage: () => subject.asObservable()
};