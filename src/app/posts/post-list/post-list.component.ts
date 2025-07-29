import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../post.module';
import { PostsService } from '../posts.service';

@Component({
  selector : 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']


})
export class PostListComponent implements OnInit {

 posts: Post[] = [];


  constructor(public postService: PostsService) {}

  ngOnInit() {

    this.posts = this.postService.getPosts();

  }

}
