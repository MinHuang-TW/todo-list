import React from "react";
import styles from './Button.module.scss'

const Button = ({
  data = null,
  onClick = null,
  text,
  icon,
  classes = null
}) => {
  const noData = data && data.length === 0;

  return (
    <>
      {!noData && (
        <button
          onClick={onClick}
          className={[
            styles.container,
            classes,
            noData ? styles['button-disabled'] : null
          ].join(" ")}
          disabled={noData ? true : false}
        >
          {icon}
          <span>{text}</span>
        </button>
      )}
    </>
  );
};

export default Button;