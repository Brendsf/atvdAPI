import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Input, Button, Text, ListItem, Avatar } from '@rneui/themed';
import axios from 'axios';
import { useState, useEffect } from 'react';

const Stack = createNativeStackNavigator();

function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Input placeholder='Email' keyboardType='email-address' autoCapitalize='none' />
      <Input placeholder='Senha' secureTextEntry />
      <Button
        title='Entrar'
        buttonStyle={styles.button}
        onPress={() => navigation.navigate('ListaUsuarios')}
      />
      <Button
        title='Cadastrar'
        buttonStyle={styles.button}
        onPress={() => navigation.navigate('Cadastro')}
      />
    </View>
  );
}

function CadastroUsuario({ navigation }) {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <Input placeholder='Nome' value={nome} onChangeText={setNome} />
      <Input placeholder='CPF' value={cpf} onChangeText={setCpf} />
      <Input placeholder='Email' keyboardType='email-address' autoCapitalize='none' value={email} onChangeText={setEmail} />
      <Input placeholder='Senha' secureTextEntry value={senha} onChangeText={setSenha} />
      <Button
        title='Cadastrar'
        buttonStyle={styles.button}
        onPress={() => {
          axios.post('http://localhost:3000/usuarios', {
            nome, cpf, email, senha
          })
            .then(() => navigation.navigate('Login'))
            .catch((error) => console.error('Erro ao cadastrar!', error));
        }}
      />
    </View>
  );
}

function CadastroContato({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [numero, setNumero] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Contato</Text>
      <Input placeholder='Nome' value={nome} onChangeText={setNome} />
      <Input placeholder='Email' value={email} onChangeText={setEmail} />
      <Input placeholder='Número' value={numero} onChangeText={setNumero} />
      <Button
        title='Cadastrar'
        buttonStyle={styles.button}
        onPress={() => {
          axios.post('http://localhost:3000/contatos', {
            name: nome,
            email,
            numero
          })
            .then(() => navigation.navigate('ListaUsuarios'))
            .catch((error) => console.error('Erro ao cadastrar:', error));
        }}
      />
    </View>
  );
}

function ListaUsuarios({ navigation }) {
  const [contatos, setContatos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/contatos')
      .then((response) => setContatos(response.data))
      .catch((error) => console.error('Erro ao carregar:', error));
  }, []);

  return (
    <View style={styles.container}>
      {contatos.map((contato, i) => (
        <ListItem
          key={i}
          bottomDivider
          onPress={() => navigation.navigate('AlterarContato', { contato })}
        >
          <Avatar size={48} rounded source={{ uri: contato.avatar_url }} />
          <ListItem.Content>
            <ListItem.Title>{contato.name}</ListItem.Title>
            <ListItem.Subtitle>{contato.numero}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      ))}
      <Button
        title='Adicionar Contato'
        buttonStyle={styles.button}
        onPress={() => navigation.navigate('ContatoCadastro')}
      />
    </View>
  );
}

function AlterarContato({ navigation, route }) {
  const { contato } = route.params;
  const [name, setName] = useState(contato.name);
  const [numero, setNumero] = useState(contato.numero);
  const [email, setEmail] = useState(contato.email);

  const atualizarContato = () => {
    axios.put(`http://localhost:3000/contatos/${contato.id}`, {
      name,
      numero,
      email
    })
      .then(() => navigation.navigate('ListaUsuarios'))
      .catch((error) => console.log('Erro ao atualizar:', error));
  };

  const excluirContato = () => {
    axios.delete(`http://localhost:3000/contatos/${contato.id}`)
      .then(() => navigation.navigate('ListaUsuarios'))
      .catch((error) => console.log('Erro ao deletar:', error));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Contato</Text>
      <Input placeholder='Nome' value={name} onChangeText={setName} />
      <Input placeholder='Número' value={numero} onChangeText={setNumero} />
      <Input placeholder='Email' value={email} onChangeText={setEmail} />
      <Button title="Salvar Alterações" buttonStyle={styles.button} onPress={atualizarContato} />
      <Button title="Excluir Contato" buttonStyle={[styles.button, { backgroundColor: '#e53935' }]} onPress={excluirContato} />
    </View>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Cadastro" component={CadastroUsuario} options={{ title: 'Cadastro' }} />
        <Stack.Screen name="ContatoCadastro" component={CadastroContato} options={{ title: 'Cadastrar Contato' }} />
        <Stack.Screen name="ListaUsuarios" component={ListaUsuarios} options={{ title: 'Lista de Contatos' }} />
        <Stack.Screen name="AlterarContato" component={AlterarContato} options={{ title: 'Editar Contato' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 25,
    marginBottom: 20,
    color: '#546e7a',
    fontWeight: '500',
    textAlign: 'center',
  },
  button: {
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#78909c',
    borderRadius: 4,
  },
});

export default App;
