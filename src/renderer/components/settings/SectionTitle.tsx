import styles from './Settings.module.css';

export default function Caption({ text }: { text: string }) {
  return <p className={styles.caption}>{text}</p>;
}
