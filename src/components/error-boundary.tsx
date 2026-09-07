import { Component, type ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('Render crashed:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.wrap}>
          <ScrollView contentContainerStyle={styles.scroll}>
            <Text style={styles.title}>Render crashed</Text>
            <Text style={styles.message}>{this.state.error.message}</Text>
            <Text style={styles.stack}>{this.state.error.stack}</Text>
          </ScrollView>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: '#fff0f0',
    paddingTop: 60,
  },
  scroll: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#c00',
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: '#900',
    marginBottom: 12,
  },
  stack: {
    fontSize: 11,
    color: '#600',
  },
});
