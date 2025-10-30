export interface Range<T> {
  from?: T;
  to?: T;
}

export interface StrictRange<T> extends Range<T> {
  from: T;
  to: T;
}
