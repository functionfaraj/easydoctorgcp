import { Component, EventEmitter, Output } from '@angular/core';
//import {Post} from "../post.model";
import {NgForm } from '@angular/forms';
import {PostsService} from '../posts.service';
@Component({
  selector : 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls : ['./post-create.component.css']
})

export class PostCreateComponent {
  newPosts = '';


  enterdcontent = '';
  enteredtitle = '';
  constructor(public postService: PostsService){}

  //@Output() postCreated = new EventEmitter<Post>();


  onAddPost(form: NgForm) {

    if (form.invalid) {
      return ;
    }

    /*const post: Post = {
       title: form.value.title ,
       content: form.value.content
      };
*/
      this.postService.addPost( form.value.title, form.value.content);

  }
}

