#include <sys/types.h>
#include <sys/stat.h>
#include <sys/wait.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <stdarg.h>
#include <stdio.h>
#include <dirent.h>
#include <errno.h>
#include <signal.h>
#include "main.h"

#define ex (execve("/bin/ls", args, NULL) == (-1))
#define ps(x) (printf("%s\n", (x)))
#define pd(x) (printf("%d\n", (x)))
#define plu(x) (printf("%lu\n", (x)))

void launcher(char **sarr)
{
	int stat;

	if (fork() == 0)
	{
		execve(sarr[0], sarr, NULL);
	}
	else
	{
		wait(&stat);
		if (WIFEXITED(stat))
		{
			shstruct(NULL)->status = WEXITSTATUS(stat);
		}
		else
		{
			printf("Not exited normally\n");
		}
	}
}
