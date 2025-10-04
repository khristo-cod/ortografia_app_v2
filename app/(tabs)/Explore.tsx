import words from '@/data/words.json';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const imageMap: Record<string, any> = {
  'campana.png': require('@/assets/images/campana.png'),
  'enfermera.png': require('@/assets/images/enfermera.png'),
  'campesino.png': require('@/assets/images/campesino.png'),
  'columpio.png': require('@/assets/images/columpio.png'),
  'timbre.png': require('@/assets/images/timbre.png'),
  'envase.png': require('@/assets/images/envase.png'),
  'bomba.png': require('@/assets/images/bomba.png'),
};

function flattenExamples(reglas: any[]): any[] {
  return reglas.flatMap(regla => regla.ejemplos.map((ejemplo: any) => ({
    ...ejemplo,
    frase: regla.frase,
    speak: regla.speak
  })));
}

export default function ExploreCard() {
  const ejemplos = flattenExamples(words.reglas);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correcto, setCorrecto] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [successSoundObject, setSuccessSoundObject] = useState<Audio.Sound | null>(null);
  const [errorSoundObject, setErrorSoundObject] = useState<Audio.Sound | null>(null);
  const router = useRouter();

  const ejemplo = ejemplos[index];

  useEffect(() => {
    let successSoundInstance: Audio.Sound;
    let errorSoundInstance: Audio.Sound;

    async function loadSounds() {
      try {
        const { sound: loadedSuccessSound } = await Audio.Sound.createAsync(
          require('@/assets/sounds/success.mp3')
        );
        const { sound: loadedErrorSound } = await Audio.Sound.createAsync(
          require('@/assets/sounds/error.mp3')
        );
        setSuccessSoundObject(loadedSuccessSound);
        setErrorSoundObject(loadedErrorSound);
        successSoundInstance = loadedSuccessSound;
        errorSoundInstance = loadedErrorSound;
      } catch (e) {
        console.log('Error cargando sonidos', e);
      }
    }

    loadSounds();

    return () => {
      if (successSoundInstance) successSoundInstance.unloadAsync();
      if (errorSoundInstance) errorSoundInstance.unloadAsync();
    };
  }, []);

  // Decir la palabra automáticamente al iniciar cada ronda
  useEffect(() => {
    if (ejemplo?.word) {
      Speech.speak(ejemplo.word, {
        language: 'es-ES',
        rate: 0.8,
        pitch: 1.1,
      });
    }
  }, [index]);

  const handleSelect = async (opcion: string) => {
    const letraCorrecta = ejemplo.word[ejemplo.incomplete.indexOf('_')];
    const esCorrecto = opcion === letraCorrecta;

    setSelected(opcion);
    setCorrecto(esCorrecto);
    setFeedback(esCorrecto ? '¡Correcto! 🎉' : '¡Incorrecto! ❌');
    try {
      if (esCorrecto) {
        if (successSoundObject) await successSoundObject.replayAsync();
      } else {
        if (errorSoundObject) await errorSoundObject.replayAsync();
      }
    } catch (e) {
      // Si el sonido falla, igual continúa el flujo
      console.log('Error reproduciendo sonido', e);
    }
    if (esCorrecto) setScore((prev) => prev + 1);

    setTimeout(() => {
      if (index + 1 < ejemplos.length) {
        setIndex((prev) => prev + 1);
      } else {
        Alert.alert('¡Juego terminado!', `Tu puntaje: ${score + (esCorrecto ? 1 : 0)}/${ejemplos.length}`);
        setIndex(0);
        setScore(0);
      }
      setSelected(null);
      setCorrecto(false);
      setFeedback(null);
    }, 1000);
  };

  const handleSpeak = () => {
    Speech.speak(ejemplo.word, {
      language: 'es-ES',
      rate: 0.8,
      pitch: 1.1,
    });
  };

  const handleEndGame = () => {
    Alert.alert(
      'Juego terminado',
      `Tu puntaje: ${score}/${ejemplos.length}\n¿Deseas reiniciar el juego?`,
      [
        {
          text: 'Sí',
          onPress: () => {
            setIndex(0);
            setScore(0);
            setSelected(null);
            setCorrecto(false);
            setFeedback(null);
          },
        },
        {
          text: 'No',
          onPress: () => {
            router.replace('/(tabs)');
          },
          style: 'cancel',
        },
      ]
    );
  };

  const gradientColors = ['#fffde4', '#ffe680', '#ffb347'] as const;

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.score}>Puntaje: {score}</Text>
      {/* Card para la frase */}
      <View style={styles.fraseCard}>
        <Text style={styles.reglaFrase}>{ejemplo.frase}</Text>
        <TouchableOpacity style={styles.fraseSpeakIcon} onPress={() => {
          Speech.speak(ejemplo.speak || ejemplo.frase, {
            language: 'es-ES',
            rate: 0.95,
            pitch: 1.1,
          });
        }}>
          <MaterialIcons name="volume-up" size={28} color="#FFA726" />
        </TouchableOpacity>
      </View>
      {/* Card para la imagen y el icono */}
      <View>
        <LinearGradient
          colors={gradientColors}
          style={styles.gradientBackground}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 0.5, y: 1 }}
        >
          <Image source={imageMap[ejemplo.image]} style={styles.image} resizeMode="contain" />
          <TouchableOpacity style={styles.speakIcon} onPress={handleSpeak}>
            <MaterialIcons name="volume-up" size={32} color="#FFA726" />
          </TouchableOpacity>
        </LinearGradient>
      </View>
      <Text style={styles.incomplete}>{ejemplo.incomplete}</Text>
      <View style={styles.options}>
        {ejemplo.options.map((letra: string, i: number) => {
          let backgroundColor = '#87CEFA';
          if (selected === letra) backgroundColor = correcto ? 'green' : 'red';

          return (
            <TouchableOpacity
              key={i}
              style={[styles.button, { backgroundColor }]}
              onPress={() => handleSelect(letra)}
              disabled={selected !== null}
            >
              <Text style={styles.buttonText}>{letra}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {feedback && <Text style={correcto ? styles.correctText : styles.incorrectText}>{feedback}</Text>}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => {
            setIndex(0);
            setScore(0);
            setSelected(null);
            setCorrecto(false);
            setFeedback(null);
          }}
        >
          <Text style={styles.resetButtonText}>Reiniciar juego</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.endButton}
          onPress={handleEndGame}
        >
          <Text style={styles.endButtonText}>Terminar juego</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
    paddingTop: 10,
  },
  card: {
    margin: 20,
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#fffbe6',
    borderWidth: 1,
    borderColor: '#ffd54f',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    position: 'relative',
  },
  frase: {
    fontSize: 22,
    color: '#333',
    marginBottom: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  speakButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 10,
  },
  speakButtonText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  reglaFrase: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  gameContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  gradientBackground: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  speakIcon: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#fffbe6',
    borderRadius: 20,
    padding: 6,
    elevation: 2,
  },
  image: { width: 200, height: 200 },
  incomplete: { fontSize: 36, marginBottom: 20 },
  options: { flexDirection: 'row', gap: 10 },
  button: {
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  buttonText: { fontSize: 24, color: '#fff' },
  correctText: { marginTop: 20, fontSize: 20, color: 'green' },
  incorrectText: { marginTop: 20, fontSize: 20, color: 'red' },
  score: { fontSize: 22, fontWeight: 'bold', alignItems: 'center', textAlign: 'center' },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginTop: 18,
    marginHorizontal: 20,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#FFA726',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 0,
    marginLeft: 2,
    marginRight: 2,
    alignItems: 'center',
    maxWidth: '40%',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  endButton: {
    flex: 1,
    backgroundColor: '#F44336',
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 2,
    marginRight: 2,
    alignItems: 'center',
    maxWidth: '40%',
  },
  endButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  fraseCard: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#fffbe6',
    borderWidth: 1,
    borderColor: '#ffd54f',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    position: 'relative',
  },
  fraseSpeakIcon: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#fffbe6',
    borderRadius: 20,
    padding: 6,
    elevation: 2,
  },
});
