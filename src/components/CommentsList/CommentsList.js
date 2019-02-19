import React from 'react';
import { StyleSheet, FlatList } from 'react-native';

import CommentItem from '../CommentItem/CommentItem';

const CommentsList = props => {
  return (
    <FlatList
      style={styles.listContainer}
      scrollEnabled={true}
      data={props.comments}           
      renderItem={(info) => (
        <CommentItem
          userName={info.item.userName}
          comment={info.item.comment}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    width: "100%"
  }
});

export default CommentsList;