import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

import { IPost } from "../post.model";
import { PostsService } from "../posts.service";
import { AuthenticationService } from 'src/app/authentication/authentication.service';


@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})

export class PostListComponent implements OnInit, OnDestroy{

  posts: IPost[] = [];
  private postSubcription: Subscription;
  isLoading = false;
  totalPosts = 0;
  postPerPage = 2;
  pageSizeOptions = [1,2,5,10];
  currentPage = 1;
  private authstatusSub: Subscription;
  userIsAuthenticated = false;
  userId: string;

  constructor(public postsService : PostsService,
              private authService: AuthenticationService){
      //la palabra public permite crear una automaticamnte una propiedad y
      //almacenara el valor
  }

  ngOnInit() {
      //se ejecuta automanticamente cuando se crea este componente
      //se recomienda su uso para inicializar componentes
    this.isLoading = true;
    this.postsService.getPosts(this.postPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postSubcription = this.postsService
        .getPostUpdateListener()
        /* .subscribe((postsReceive: IPost[]) => {
          this.isLoading = false;
          this.posts = postsReceive;
          }); */ //se quito por la paginacion
        .subscribe((postData: {posts: IPost[], postCount: number}) => {
          this.isLoading = false;
          this.posts = postData.posts;
          this.totalPosts = postData.postCount;
        });

    this.userIsAuthenticated = this.authService.getIsAuth();

    this.authstatusSub = this.authService
          .getAuthStatusListener()
          .subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
            this.userId = this.authService.getUserId();
    });
  }

  onDelete(postId: string){
    //this.postsService.deletePost(postId);

    this.isLoading = true;
    this.postsService.deletePost(postId)
            .subscribe(() => {
              this.postsService.getPosts(this.postPerPage, this.currentPage);
            }, () => {
              this.isLoading = false;
            });
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading= true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postPerPage, this.currentPage);
  }

  ngOnDestroy(){
    //elimina la subscrpcion y evita las perdidas de memoria
    this.postSubcription.unsubscribe();
    this.authstatusSub .unsubscribe();
  }
}
