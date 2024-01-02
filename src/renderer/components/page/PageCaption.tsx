import styles from './PageCaption.module.css';

export default function PageCaption({ text = '' }: { text: string }) {
  return <div className={styles.caption}>{text}</div>;
}
