import { Subject } from 'rxjs';

const subject = new Subject();

export const LiveOrderService = {
    sendMessage: message => subject.next({ message : message}),
    clearMessages: () => subject.next(),
    getMessage: () => subject.asObservable()
};