// src/books/books.gateway.ts

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Inject } from '@nestjs/common';
import { StoryService } from 'src/story/domain/interfaces/story.service.interface';
import { StoryMapper } from 'src/story/application/mapper/story.mapper';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
export class StoryGateway {
  private mapper: StoryMapper;
  constructor(
    @Inject('StoryService')
    private readonly service: StoryService,
  ) {
    this.mapper = new StoryMapper();
  }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('searchHistories')
  async handleBuscarLibros(@MessageBody() chatMessage: string): Promise<void> {
    console.log(chatMessage);
    const stories = await this.service.findAll();
    this.server.emit(
      'resultadosBusqueda',
      stories.map((story) => this.mapper.toDto(story)),
    );
    /*try {
      const responseChatGPT = await axios.post(
        'https://api.openai.com/v1/engines/davinci-codex/completions',
        {
          prompt: `Encuentra libros sobre ${chatMessage}`,
          max_tokens: 150,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer tu_clave_de_API_de_OpenAI`,
          },
        },
      );

      const foundBooks = this.processAnswer(
        responseChatGPT.data.choices[0].text,
      );
      this.server.emit('resultadosBusqueda', foundBooks);
    } catch (error) {
      console.error(error);
    }*/
  }

  private processAnswer(respuesta: string): any[] {
    // Analizar la respuesta de ChatGPT y buscar libros en la colección de libros
    // Devolver los libros encontrados como un arreglo de objetos
    // { titulo, autor, contenido, palabrasClave }
    return [respuesta];
  }
}
