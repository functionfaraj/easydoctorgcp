import { Post } from './post.module';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];

  getPosts() {
    return this.posts;
  }

  addPost(title: string , content: string) {
    const post: Post = {title: title, contant: content};
    this.posts.push(post);
  }

}
