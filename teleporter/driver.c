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

#define ps(x) (printf("%s\n", (x)))
#define pd(x) (printf("%d\n", (x)))
#define plu(x) (printf("%lu\n", (x)))
#define pp(x) (printf("%p\n", (x)))


/**
 * This set of functions demonstrates a proof of concept that functions can act,
 * howbeit in a limited way, as a form of data storage mechanism.
 *
 * The main function stores the address of the variable 'status', in, and by, a
 * call to upd_stat() (which acts as the 'telelporter'). Then another function,
 * launcher(), calls upd_stat() to update the value of status. Note that even if
 * launcher() is a million call levels/stacks down from main, and the address of
 * status wasn't passed down in prototype definitions, a simple call to upd_stat()
 * would update status declared a miilion stacks up!
 *
 * It's only a cool creation for now as I think the use of, say, structures would be a more
 * efficient way of accessing and modifying stored data across multiple stacks.
 */

typedef struct shell
{
	int status;
} shell_t;

shell_t *shstruct(shell_t *shell);
void launcherr(char **sarr);


int main (void)
{
	char *sarr[] = {"/usr/bin/ls", "gv", NULL};
	int status = 1024;
	shell_t shell = {0};

	shstruct(&shell);
	pd(shell.status);

	launcherr(sarr);
	pd(shell.status);

	return (0);
}




/**
 * shstruct - serves as a storage for shell_t struct that can
 * be accessed by any calling function. This works, as functions are
 * external/global-scope objects, and Betty prohibits the use of global variables.
 * @shell: address of the shell_t struct to store.
 *
 * Return: the address of the currently stored struct.
 */
shell_t *shstruct(shell_t *shell)
{
	static shell_t *sp1;

	if (shell)
	{
		/* sp1 will not be updated if shell is NULL */
		sp1 = shell;
	}

	return (sp1);
}




void launcherr(char **sarr)
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
