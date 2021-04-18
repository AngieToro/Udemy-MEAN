import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';

import { Subject } from "rxjs";
import { map } from "rxjs/operators";

import { IPost } from "./post.model";
import { environment } from "../../environments/environment";

const BackendUrl = environment.apiUrl + "/posts/";

//es el servicio en el cliente (front-end)
@Injectable({providedIn: 'root'})
export class PostsService{

  constructor (private http: HttpClient, private router: Router){
      //el hhtpclient permite enviar solicitudes (request) a traves del client hht
      //hacia el backend
  };

  private posts: IPost[] = [];
  private postsUpdated = new Subject<{posts: IPost[], postCount: number}>();

  getPosts(postsPerPage: number, currentPage: number){
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    //http://localhost:3000/api/posts?pageSize=2&page=1
    this.http
        .get<{message:string; posts: any, maxPosts: number}>(
          BackendUrl + queryParams
          )
        .pipe(
          map((postData) => {
          return {
            posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator
              };
            }),
            maxPosts: postData.maxPosts
            };
          })
        )
        .subscribe((transformedPostData) => {
            console.log(transformedPostData);
            this.posts = transformedPostData.posts;
            this.postsUpdated.next({
              posts: [...this.posts],
              postCount: transformedPostData.maxPosts
            });   //recomendada para tener una copia del objeto y asi
                                                       //no alterar el objeto originaly buscar ser inmutable
      });
  }

  getPostUpdateListener(){

    return this.postsUpdated.asObservable();  //escucha los camios pero no los emite
  }

  ///obtener post con un determinado id para modificar
  getPost(id: String){

    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      imagePath: string,
      creator: string
    }>
      (BackendUrl + id);
    }

  addPost(titleP: string, contentP: string, imageP: File){

    /* const post: IPost = {
      id: null,
      title: titleP,
      content: contentP
    }; */

    const postData = new FormData();
    postData.append("title", titleP);
    postData.append("content", contentP);
    postData.append("image", imageP);

    this.http
      .post<{message: string; post: IPost }>
          (BackendUrl,
          //post
          postData
        )
      .subscribe(responsedata => {
        console.log("Added");
        /* const post: IPost = {
          id: responsedata.post.id,
          title: titleP,
          content: contentP,
          imagePath:responsedata.post.imagePath
        };
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]); */ //se quito por la paginacion
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string){
    return this.http.delete(BackendUrl + postId);
    /* .subscribe(() => {
      console.log("Deleted");
      const updatedposts = this.posts.filter(post => post.id !== postId);
      this.posts = updatedposts;
      this.postsUpdated.next([...this.posts]);
    }); */ //se quito por la paginacion y se agrego la palbra return
  }

  updatepost(idP: string, titleP: string, contentP: string, imageP: File | string){

    let postData:  IPost | FormData;

    if (typeof imageP === "object"){
      //si es File
      postData = new FormData();
      postData.append("id", idP);
      postData.append("title", titleP);
      postData.append("content", contentP);
      postData.append("image", imageP);
    } else {
      //si es string
      postData = {
        id: idP,
        title: titleP,
        content: contentP,
        imagePath: imageP,
        creator: null
      }
    }

    this.http.put(BackendUrl + idP, postData)
        .subscribe(response => {
          console.log("Updated= ", response);
          /* const updateedPosts = [...this.posts];
          const oldPostIndex = updateedPosts.findIndex(p => {
            p.id === idP
          });
         const post: IPost = {
          id: idP,
          title: titleP,
          content: contentP,
          imagePath: ""
         }
          updateedPosts[oldPostIndex] = post;
          this.posts = updateedPosts;
          this.postsUpdated.next([...this.posts]); */ //se quito por la paginacion, porque se devuelve a una pagina donde se obtiene ultima version de todas maneras (ngInit)
          this.router.navigate(["/"]);
        });
  }
}
